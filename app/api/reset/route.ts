import { resetStore } from "@/lib/mock-db";
import { ok } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// POST /api/reset — kembalikan mock-db ke kondisi awal (seed).
// Berguna saat demo diulang beberapa kali di depan klien.
export async function POST() {
  resetStore();
  return ok({ message: "Data demo berhasil direset ke kondisi awal." });
}
