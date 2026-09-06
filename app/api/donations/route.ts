import type { NextRequest } from "next/server";
import { listRecentDonations } from "@/lib/mock-db";
import { ok } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// GET /api/donations?limit=N
// Daftar wakif terbaru untuk halaman transparansi. Proyeksi PUBLIK dari
// transaksi lunas — tanpa email/telepon, nama disamarkan bila anonim.
export async function GET(req: NextRequest) {
  const raw = Number(req.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 50) : 12;
  return ok(listRecentDonations(limit));
}
