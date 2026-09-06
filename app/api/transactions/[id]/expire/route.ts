import { markTransactionExpired } from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// POST /api/transactions/:id/expire
// Dipanggil halaman "menunggu pembayaran" saat countdown benar-benar habis.
// Di produksi, status kedaluwarsa biasanya di-set oleh job terjadwal di sisi
// server / callback gateway, bukan oleh browser.
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const result = markTransactionExpired(decodeURIComponent(params.id));
  if ("error" in result) return fail(result.error, 409);
  return ok(result);
}
