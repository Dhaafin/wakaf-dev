import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions, programs, certificates } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import {
  verifyMidtransSignature,
  mapMidtransStatus,
  type MidtransNotificationPayload,
} from "@/lib/midtrans";
import { eq, sql } from "drizzle-orm";
import { createId } from "@/lib/id";

export const dynamic = "force-dynamic";

// POST /api/payment/notification
// Webhook handler resmi untuk notifikasi status pembayaran dari Midtrans
export async function POST(req: NextRequest) {
  try {
    let payload: MidtransNotificationPayload;
    try {
      payload = await req.json();
    } catch {
      return fail("Body notifikasi JSON tidak valid.", 400);
    }

    // 1. Validasi Keamanan Signature Key (SHA-512)
    const isValidSignature = verifyMidtransSignature(payload);
    if (!isValidSignature) {
      console.warn("Midtrans Webhook: Invalid signature_key detected.", {
        order_id: payload.order_id,
        signature_key: payload.signature_key,
      });
      return fail("Signature tidak valid.", 401);
    }

    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
    } = payload;

    // 2. Cari transaksi terkait di database
    const tx = await db.query.transactions.findFirst({
      where: eq(transactions.id, order_id),
    });

    if (!tx) {
      console.warn(`Midtrans Webhook: Transaksi ${order_id} tidak ditemukan.`);
      return fail("Transaksi tidak ditemukan.", 404);
    }

    // Validasi kesesuaian nominal tagihan (mencegah manipulasi underpayment)
    const payloadAmount = Math.round(Number(payload.gross_amount));
    if (payloadAmount !== tx.total) {
      console.warn("Midtrans Webhook: Nominal mismatch detected.", {
        order_id,
        payloadAmount,
        expectedTotal: tx.total,
      });
      return fail("Nominal pembayaran tidak cocok dengan tagihan.", 400);
    }

    const targetStatus = mapMidtransStatus(transaction_status, fraud_status);

    // 3. Tangani Status: LUNAS (Paid)
    if (targetStatus === "paid") {
      // Pengecekan Idempotensi: jika sudah lunas, langsung return 200 OK
      if (tx.status === "paid") {
        return ok({ message: "Transaksi sudah berstatus lunas (idempotent)." });
      }

      // Format nomor sertifikat resmi: mis. SW/2026/09/xxxxxx
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const randomSuffix = createId("cert").slice(-6).toUpperCase();
      const certId = `SW/${year}/${month}/${randomSuffix}`;

      // Nama pihak penerima sertifikat (atas nama sendiri atau orang lain)
      const namaPihak =
        tx.atasNama === "orang-lain" && tx.namaAtasNama
          ? tx.namaAtasNama
          : tx.namaWakif;

      // Eksekusi Atomic Transaction di database
      await db.transaction(async (txDb) => {
        // a. Terbitkan sertifikat wakaf digital
        await txDb.insert(certificates).values({
          id: certId,
          transactionId: tx.id,
          programId: tx.programId,
          programNama: tx.programNama,
          programType: tx.programType,
          namaPihak,
          nominal: tx.nominal,
          tanggal: now,
          nazhir: "Nazhir Yayasan Khazanah Berkah Mulia",
        });

        // b. Update status transaksi menjadi 'paid'
        await txDb
          .update(transactions)
          .set({
            status: "paid",
            paidAt: now,
            certificateId: certId,
            bank: payment_type ? payment_type.toUpperCase() : tx.bank,
          })
          .where(eq(transactions.id, tx.id));

        // c. Akumulasikan dana terkumpul dan jumlah wakif di program
        await txDb
          .update(programs)
          .set({
            terkumpul: sql`${programs.terkumpul} + ${tx.nominal}`,
            jumlahWakif: sql`${programs.jumlahWakif} + 1`,
          })
          .where(eq(programs.id, tx.programId));
      });

      return ok({ status: "OK", transaction_status: "paid", certId });
    }

    // 4. Tangani Status: EXPIRED
    if (targetStatus === "expired") {
      if (tx.status !== "paid") {
        await db
          .update(transactions)
          .set({ status: "expired" })
          .where(eq(transactions.id, tx.id));
      }
      return ok({ status: "OK", transaction_status: "expired" });
    }

    // 5. Tangani Status: PENDING / LAINNYA
    return ok({ status: "OK", transaction_status: targetStatus });
  } catch (err) {
    console.error("POST /api/payment/notification error:", err);
    return fail("Terjadi kesalahan saat memproses notifikasi Midtrans.", 500);
  }
}
