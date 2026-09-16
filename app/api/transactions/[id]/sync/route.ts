import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { serializeTransaction } from "@/lib/db/serialize";
import { checkMidtransStatus, mapMidtransStatus } from "@/lib/midtrans";
import { settleTransaction } from "@/lib/settlement";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/transactions/:id/sync
// Sinkronisasi status transaksi secara real-time langsung ke Midtrans API
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = decodeURIComponent(resolvedParams.id);

    const tx = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });

    if (!tx) {
      return fail("Transaksi tidak ditemukan.", 404);
    }

    // Jika sudah paid, langsung kembalikan data transaksi lunas
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

      // Tangani status LUNAS secara atomic & idempotent
      if (targetStatus === "paid") {
        const settlement = await settleTransaction(tx.id, {
          bank: mtStatus.payment_type ? mtStatus.payment_type.toUpperCase() : tx.bank,
        });

        return ok(settlement.transaction);
      }

      // Tangani status EXPIRED (hanya jika status saat ini masih pending)
      if (targetStatus === "expired" && tx.status === "pending") {
        await db
          .update(transactions)
          .set({ status: "expired" })
          .where(and(eq(transactions.id, tx.id), eq(transactions.status, "pending")));

        const updated = await db.query.transactions.findFirst({
          where: eq(transactions.id, tx.id),
        });
        return ok(serializeTransaction(updated || tx));
      }
    }

    return ok(serializeTransaction(tx));
  } catch (err) {
    console.error("POST /api/transactions/:id/sync error:", err);
    return fail("Gagal menyinkronkan status pembayaran.", 500);
  }
}
