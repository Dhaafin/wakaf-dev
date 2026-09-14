import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { serializeTransaction } from "@/lib/db/serialize";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/transactions/:id/expire
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
      return fail("Transaksi sudah dibayar, tidak dapat kedaluwarsa.", 400);
    }

    if (tx.status === "expired") {
      return ok(serializeTransaction(tx));
    }

    // Hanya boleh di-expire bila waktu saat ini memang sudah melewati expiresAt (dengan toleransi 5 detik)
    const now = new Date();
    const toleranceMs = 5000;
    if (now.getTime() + toleranceMs < new Date(tx.expiresAt).getTime()) {
      return fail("Batas waktu pembayaran belum berakhir.", 400);
    }

    await db
      .update(transactions)
      .set({ status: "expired" })
      .where(eq(transactions.id, id));

    const updated = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });

    return ok(serializeTransaction(updated));
  } catch (err) {
    console.error("POST /api/transactions/:id/expire error:", err);
    return fail("Gagal memperbarui status transaksi.", 500);
  }
}
