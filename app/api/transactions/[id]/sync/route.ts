import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions, programs, certificates } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { serializeTransaction } from "@/lib/db/serialize";
import { checkMidtransStatus, mapMidtransStatus } from "@/lib/midtrans";
import { eq, sql } from "drizzle-orm";
import { createId } from "@/lib/id";

export const dynamic = "force-dynamic";

// POST /api/transactions/:id/sync
// Sinkronisasi status transaksi secara real-time langsung ke Midtrans API
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

    // Jika sudah paid, langsung return data transaksi lunas
    if (tx.status === "paid") {
      return ok(serializeTransaction(tx));
    }

    // Tanya status langsung ke Midtrans API server
    const mtStatus = await checkMidtransStatus(tx.id);

    if (mtStatus) {
      const targetStatus = mapMidtransStatus(
        mtStatus.transaction_status,
        mtStatus.fraud_status,
      );

      // Tangani status LUNAS
      if (targetStatus === "paid") {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const randomSuffix = createId("cert").slice(-6).toUpperCase();
        const certId = `SW/${year}/${month}/${randomSuffix}`;

        const namaPihak =
          tx.atasNama === "orang-lain" && tx.namaAtasNama
            ? tx.namaAtasNama
            : tx.namaWakif;

        await db.transaction(async (txDb) => {
          // a. Terbitkan sertifikat resmi
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

          // b. Update status transaksi menjadi paid
          await txDb
            .update(transactions)
            .set({
              status: "paid",
              paidAt: now,
              certificateId: certId,
              bank: mtStatus.payment_type
                ? mtStatus.payment_type.toUpperCase()
                : tx.bank,
            })
            .where(eq(transactions.id, tx.id));

          // c. Akumulasikan nominal & jumlah wakif di program
          await txDb
            .update(programs)
            .set({
              terkumpul: sql`${programs.terkumpul} + ${tx.nominal}`,
              jumlahWakif: sql`${programs.jumlahWakif} + 1`,
            })
            .where(eq(programs.id, tx.programId));
        });

        const updated = await db.query.transactions.findFirst({
          where: eq(transactions.id, tx.id),
        });
        return ok(serializeTransaction(updated));
      }

      // Tangani status EXPIRED
      if (targetStatus === "expired" && tx.status !== "paid") {
        await db
          .update(transactions)
          .set({ status: "expired" })
          .where(eq(transactions.id, tx.id));

        const updated = await db.query.transactions.findFirst({
          where: eq(transactions.id, tx.id),
        });
        return ok(serializeTransaction(updated));
      }
    }

    return ok(serializeTransaction(tx));
  } catch (err) {
    console.error("POST /api/transactions/:id/sync error:", err);
    return fail("Gagal menyinkronkan status pembayaran.", 500);
  }
}
