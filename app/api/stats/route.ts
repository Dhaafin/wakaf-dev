import { getGlobalStats } from "@/lib/mock-db";
import { ok } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// GET /api/stats — angka agregat untuk beranda & halaman transparansi.
export async function GET() {
  return ok(getGlobalStats());
}
