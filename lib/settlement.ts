import { db } from "@/lib/db/client";
import { transactions, programs, certificates } from "@/lib/db/schema";
import { createId } from "@/lib/id";
import { serializeTransaction, serializeCertificate } from "@/lib/db/serialize";
import { eq, sql, and } from "drizzle-orm";
import type { Transaction, Certificate } from "@/types";

export interface SettleTransactionResult {
  alreadyPaid: boolean;
  transaction: Transaction;
  certificate: Certificate | null;
}

/**
 * Layanan terpusat & aman (atomic & idempotent) untuk menyelesaikan pembayaran transaksi donasi.
 *
 * Mencegah race-condition double-crediting antara Webhook Midtrans dan Polling Frontend.
 * Seluruh mutasi (Sertifikat, Transaksi, dan Saldo Program) dibungkus dalam 1 db.transaction.
 */
export async function settleTransaction(
  txId: string,
  options?: {
    bank?: string;
    paidAt?: Date;
  },
): Promise<SettleTransactionResult> {
  // 1. Ambil transaksi saat ini
  const tx = await db.query.transactions.findFirst({
    where: eq(transactions.id, txId),
  });

  if (!tx) {
    throw new Error(`Transaksi ${txId} tidak ditemukan.`);
  }

  // 2. Jika sudah paid (Idempotensi: sudah diproses webhook atau thread lain)
  if (tx.status === "paid") {
    const existingCert = await db.query.certificates.findFirst({
      where: eq(certificates.transactionId, tx.id),
    });
    return {
      alreadyPaid: true,
      transaction: serializeTransaction(tx),
      certificate: existingCert ? serializeCertificate(existingCert) : null,
    };
  }

  // Siapkan data sertifikat
  const now = options?.paidAt || new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const randomSuffix = createId("cert").slice(-6).toUpperCase();
  const certId = `SW/${year}/${month}/${randomSuffix}`;

  const namaPihak =
    tx.atasNama === "orang-lain" && tx.namaAtasNama
      ? tx.namaAtasNama
      : tx.namaWakif;

  // 3. Kunci status transaksi (Atomic update)
  // Hanya akan berhasil jika status saat ini benar-benar masih 'pending'
  const [updatedTx] = await db
    .update(transactions)
    .set({
      status: "paid",
      paidAt: now,
      certificateId: certId,
      bank: options?.bank ? options.bank.toUpperCase() : tx.bank,
    })
    .where(and(eq(transactions.id, tx.id), eq(transactions.status, "pending")))
    .returning();

  // Jika baris tidak ter-update, berarti thread lain/webhook baru saja menyelesaikan ini
  if (!updatedTx) {
    const currentTx = await db.query.transactions.findFirst({
      where: eq(transactions.id, tx.id),
    });
    const cert = await db.query.certificates.findFirst({
      where: eq(certificates.transactionId, tx.id),
    });
    return {
      alreadyPaid: true,
      transaction: serializeTransaction(currentTx || tx),
      certificate: cert ? serializeCertificate(cert) : null,
    };
  }

  // 4. Buat sertifikat resmi
  const [createdCert] = await db
    .insert(certificates)
    .values({
      id: certId,
      transactionId: tx.id,
      programId: tx.programId,
      programNama: tx.programNama,
      programType: tx.programType,
      namaPihak,
      nominal: tx.nominal,
      tanggal: now,
      nazhir: "Nazhir Yayasan Khazanah Berkah Mulia",
    })
    .returning();

  // 5. Akumulasikan nominal & jumlah wakif di program
  await db
    .update(programs)
    .set({
      terkumpul: sql`${programs.terkumpul} + ${tx.nominal}`,
      jumlahWakif: sql`${programs.jumlahWakif} + 1`,
    })
    .where(eq(programs.id, tx.programId));

  return {
    alreadyPaid: false,
    transaction: serializeTransaction(updatedTx),
    certificate: serializeCertificate(createdCert),
  };
}
