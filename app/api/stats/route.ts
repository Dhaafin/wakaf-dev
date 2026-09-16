import { db } from "@/lib/db/client";
import { sql } from "drizzle-orm";
import { ok, fail } from "@/lib/api/server";
import type { GlobalStats } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/stats — angka agregat riil dari Neon DB untuk Beranda & Transparansi.
export async function GET() {
  try {
    const result = await db.execute<{
      totalTerkumpul: string;
      totalWakif: string;
      totalTransaksiPaid: string;
      totalProgram: string;
      totalDisalurkan: string;
    }>(sql`
      SELECT
        COALESCE((
          SELECT SUM(terkumpul)
          FROM programs
          WHERE deleted_at IS NULL
        ), 0)::text AS "totalTerkumpul",

        COALESCE((
          SELECT SUM(jumlah_wakif)
          FROM programs
          WHERE deleted_at IS NULL
        ), 0)::text AS "totalWakif",

        COALESCE((
          SELECT COUNT(*)
          FROM transactions
          WHERE status = 'paid'
        ), 0)::text AS "totalTransaksiPaid",

        COALESCE((
          SELECT COUNT(*)
          FROM programs
          WHERE aktif = true AND deleted_at IS NULL
        ), 0)::text AS "totalProgram",

        COALESCE((
          SELECT SUM(nominal)
          FROM disbursements
        ), 0)::text AS "totalDisalurkan"
    `);

    const row = result.rows[0];
    const stats: GlobalStats = {
      totalTerkumpul: Number(row?.totalTerkumpul ?? 0),
      totalWakif: Number(row?.totalWakif ?? 0),
      totalTransaksiPaid: Number(row?.totalTransaksiPaid ?? 0),
      totalProgram: Number(row?.totalProgram ?? 0),
      totalDisalurkan: Number(row?.totalDisalurkan ?? 0),
    };

    return ok(stats);
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return fail("Gagal memuat statistik global.", 500);
  }
}
