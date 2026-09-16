import type { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { transactions } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { eq, desc, and, isNotNull } from "drizzle-orm";
import type { PublicDonation, ProgramType } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/donations?limit=N&programId=...
// Proyeksi PUBLIK dari transaksi lunas — nama disamarkan jadi "Hamba Allah" bila anonim
export async function GET(req: NextRequest) {
  try {
    const rawLimit = Number(req.nextUrl.searchParams.get("limit"));
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 50)
      : 12;
    const programId = req.nextUrl.searchParams.get("programId")?.trim();

    const conditions = [
      eq(transactions.status, "paid"),
      isNotNull(transactions.paidAt),
    ];
    if (programId) {
      conditions.push(eq(transactions.programId, programId));
    }

    const items = await db.query.transactions.findMany({
      where: and(...conditions),
      orderBy: [desc(transactions.paidAt)],
      limit,
    });

    const donations: PublicDonation[] = items.map((t) => {
      const anonim = t.visibilitas === "anonim";
      const namaAsli =
        t.atasNama === "orang-lain" && t.namaAtasNama
          ? t.namaAtasNama
          : t.namaWakif;

      return {
        id: t.id,
        nama: anonim ? "Hamba Allah" : namaAsli,
        anonim,
        programId: t.programId,
        programNama: t.programNama,
        program_type: t.programType as ProgramType,
        nominal: Number(t.nominal),
        doa: t.doa ?? undefined,
        paidAt:
          t.paidAt instanceof Date
            ? t.paidAt.toISOString()
            : String(t.paidAt),
      };
    });

    return ok(donations);
  } catch (err) {
    console.error("GET /api/donations error:", err);
    return fail("Gagal memuat daftar donasi publik.", 500);
  }
}

