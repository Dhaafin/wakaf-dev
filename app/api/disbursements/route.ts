import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { disbursements, programs } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { validateDisbursementForm } from "@/lib/validation";
import { createId } from "@/lib/id";
import { eq, isNull, and, or, ilike, desc, asc, sql } from "drizzle-orm";
import type {
  DisbursementWithProgram,
  DisbursementStatsSummary,
  ProgramCategory,
  ProgramType,
} from "@/types";

export const dynamic = "force-dynamic";

// GET /api/disbursements
// Mengambil daftar laporan penyaluran dana dengan filter, pagination, dan ringkasan KPI
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const programId = searchParams.get("programId")?.trim();
    const sort = searchParams.get("sort")?.trim() || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const offset = (page - 1) * limit;

    // Filter conditions
    const conditions = [];

    if (programId) {
      conditions.push(eq(disbursements.programId, programId));
    }

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(
        or(
          ilike(disbursements.judul, pattern),
          ilike(disbursements.deskripsi, pattern),
        ),
      );
    }

    // Determine sorting
    let orderBy = [desc(disbursements.tanggal)];
    if (sort === "oldest") {
      orderBy = [asc(disbursements.tanggal)];
    } else if (sort === "nominal_desc") {
      orderBy = [desc(disbursements.nominal)];
    } else if (sort === "nominal_asc") {
      orderBy = [asc(disbursements.nominal)];
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 1. Total hitungan data yang cocok
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(disbursements)
      .where(whereClause);
    const total = Number(countRow?.count ?? 0);

    // 2. Query items beserta relasi program
    const records = await db.query.disbursements.findMany({
      where: whereClause,
      orderBy,
      limit,
      offset,
      with: {
        program: {
          columns: {
            id: true,
            nama: true,
            slug: true,
            kategori: true,
            programType: true,
            terkumpul: true,
            target: true,
          },
        },
      },
    });

    const items: DisbursementWithProgram[] = records.map((r) => ({
      id: r.id,
      programId: r.programId,
      tanggal:
        r.tanggal instanceof Date
          ? r.tanggal.toISOString()
          : String(r.tanggal),
      judul: r.judul,
      deskripsi: r.deskripsi,
      nominal: Number(r.nominal),
      buktiImageUrl: r.buktiImageUrl ?? undefined,
      buktiFileName: r.buktiFileName ?? undefined,
      program: r.program
        ? {
            id: r.program.id,
            nama: r.program.nama,
            slug: r.program.slug,
            kategori: r.program.kategori as ProgramCategory,
            programType: r.program.programType as ProgramType,
            terkumpul: Number(r.program.terkumpul),
            target: Number(r.program.target),
          }
        : undefined,
    }));

    // 3. Agregasi KPI global penyaluran dari seluruh tabel disbursements
    const [summaryRow] = await db
      .select({
        totalNominal: sql<number>`COALESCE(SUM(${disbursements.nominal}), 0)::bigint`,
        totalCount: sql<number>`COUNT(*)::int`,
        programCount: sql<number>`COUNT(DISTINCT ${disbursements.programId})::int`,
      })
      .from(disbursements);

    const totalNominal = Number(summaryRow?.totalNominal ?? 0);
    const totalCount = Number(summaryRow?.totalCount ?? 0);
    const programCount = Number(summaryRow?.programCount ?? 0);
    const avgNominal = totalCount > 0 ? Math.round(totalNominal / totalCount) : 0;

    const statsSummary: DisbursementStatsSummary = {
      totalNominal,
      totalCount,
      programCount,
      avgNominal,
    };

    return ok({
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      statsSummary,
    });
  } catch (err) {
    console.error("GET /api/disbursements error:", err);
    return fail("Gagal memuat daftar penyaluran dana.", 500);
  }
}

// POST /api/disbursements
// Tambah laporan penyaluran dana baru (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return fail("Format request tidak valid.", 400);
    }

    const programId = String(body.programId ?? "").trim();
    if (!programId) {
      return fail("Program wajib dipilih.", 422, {
        programId: "Pilih program terlebih dahulu.",
      });
    }

    const values = {
      judul: String(body.judul ?? ""),
      deskripsi: String(body.deskripsi ?? ""),
      nominal: Number(body.nominal ?? 0),
      buktiImageUrl: String(body.buktiImageUrl ?? ""),
      buktiFileName: String(body.buktiFileName ?? ""),
    };

    const fieldErrors = validateDisbursementForm(values);
    if (Object.keys(fieldErrors).length > 0) {
      return fail("Periksa kembali isian form.", 422, fieldErrors);
    }

    // Pastikan program valid
    const existingProgram = await db.query.programs.findFirst({
      where: and(eq(programs.id, programId), isNull(programs.deletedAt)),
    });

    if (!existingProgram) {
      return fail("Program tidak ditemukan.", 404);
    }

    const newId = createId("dsb");
    const [created] = await db
      .insert(disbursements)
      .values({
        id: newId,
        programId: existingProgram.id,
        judul: values.judul.trim(),
        deskripsi: values.deskripsi.trim(),
        nominal: values.nominal,
        buktiImageUrl: values.buktiImageUrl.trim() || null,
        buktiFileName: values.buktiFileName.trim() || null,
      })
      .returning();

    const disbursementWithProg: DisbursementWithProgram = {
      id: created.id,
      programId: created.programId,
      tanggal:
        created.tanggal instanceof Date
          ? created.tanggal.toISOString()
          : String(created.tanggal),
      judul: created.judul,
      deskripsi: created.deskripsi,
      nominal: Number(created.nominal),
      buktiImageUrl: created.buktiImageUrl ?? undefined,
      buktiFileName: created.buktiFileName ?? undefined,
      program: {
        id: existingProgram.id,
        nama: existingProgram.nama,
        slug: existingProgram.slug,
        kategori: existingProgram.kategori as ProgramCategory,
        programType: existingProgram.programType as ProgramType,
        terkumpul: Number(existingProgram.terkumpul),
        target: Number(existingProgram.target),
      },
    };

    return ok(disbursementWithProg, 201);
  } catch (err) {
    console.error("POST /api/disbursements error:", err);
    return fail("Gagal mencatat penyaluran dana.", 500);
  }
}
