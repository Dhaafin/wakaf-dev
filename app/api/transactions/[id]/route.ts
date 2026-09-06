import { getTransaction } from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// GET /api/transactions/:id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const tx = getTransaction(decodeURIComponent(params.id));
  if (!tx) return fail("Transaksi tidak ditemukan.", 404);
  return ok(tx);
}
