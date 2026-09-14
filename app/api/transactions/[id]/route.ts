import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { serializeTransaction } from "@/lib/db/serialize";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/transactions/:id
export async function GET(
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

    return ok(serializeTransaction(tx));
  } catch (err) {
    console.error("GET /api/transactions/:id error:", err);
    return fail("Gagal memuat data transaksi.", 500);
  }
}
