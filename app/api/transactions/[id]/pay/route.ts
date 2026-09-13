import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions, programs, certificates } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { serializeTransaction, serializeCertificate } from "@/lib/db/serialize";
import { eq, sql } from "drizzle-orm";
import { createId } from "@/lib/id";

export const dynamic = "force-dynamic";

// POST /api/transactions/:id/pay
// Simulasi pelunasan pembayaran / manual settlement
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = decodeURIComponent(params.id);

    const tx = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });

    if (!tx) {
      return fail("Transaksi tidak ditemukan.", 404);
    }

    if (tx.status === "paid") {
      const existingCert = await db.query.certificates.findFirst({
        where: eq(certificates.transactionId, tx.id),
      });
      return ok({
        transaction: serializeTransaction(tx),
        certificate: existingCert ? serializeCertificate(existingCert) : null,
      });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const randomSuffix = createId("cert").slice(-6).toUpperCase();
    const certId = `SW/${year}/${month}/${randomSuffix}`;

    const namaPihak =
      tx.atasNama === "orang-lain" && tx.namaAtasNama
        ? tx.namaAtasNama
        : tx.namaWakif;

    let createdCert: any;

    await db.transaction(async (txDb) => {
      // 1. Terbitkan sertifikat
      const [cert] = await txDb
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
      createdCert = cert;

      // 2. Update status transaksi
      await txDb
        .update(transactions)
        .set({
          status: "paid",
          paidAt: now,
          certificateId: certId,
        })
        .where(eq(transactions.id, tx.id));

      // 3. Tambah progres dana terkumpul dan wakif program
      await txDb
        .update(programs)
        .set({
          terkumpul: sql`${programs.terkumpul} + ${tx.nominal}`,
          jumlahWakif: sql`${programs.jumlahWakif} + 1`,
        })
        .where(eq(programs.id, tx.programId));
    });

    const updatedTx = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });

    return ok({
      transaction: serializeTransaction(updatedTx),
      certificate: serializeCertificate(createdCert),
    });
  } catch (err) {
    console.error("POST /api/transactions/:id/pay error:", err);
    return fail("Gagal memperbarui status transaksi.", 500);
  }
}
