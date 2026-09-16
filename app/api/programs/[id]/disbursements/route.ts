import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { disbursements, programs } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { validateDisbursementForm } from "@/lib/validation";
import { createId } from "@/lib/id";
import { serializeProgram } from "@/lib/db/serialize";
import { eq, isNull, and } from "drizzle-orm";
import type { DisbursementReport } from "@/types";

export const dynamic = "force-dynamic";

// POST /api/programs/:id/disbursements
// Catat laporan penyaluran dana untuk sebuah program ke Neon DB (Admin only).
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Verifikasi hak akses admin melalui Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    const programId = decodeURIComponent(params.id);

    // 2. Parse & validasi body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return fail("Body tidak valid.", 400);
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

    // 3. Pastikan program ada di Neon DB
    const existingProgram = await db.query.programs.findFirst({
      where: and(eq(programs.id, programId), isNull(programs.deletedAt)),
    });

    if (!existingProgram) {
      return fail("Program tidak ditemukan.", 404);
    }

    // 4. Simpan record penyaluran baru ke Neon PostgreSQL
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

    // 5. Ambil data program terbaru beserta daftar penyalurannya
    const updatedProgramData = await db.query.programs.findFirst({
      where: eq(programs.id, existingProgram.id),
      with: {
        disbursements: {
          orderBy: (d, { desc: descOrder }) => [descOrder(d.tanggal)],
        },
      },
    });

    const serializedDisbursement: DisbursementReport = {
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
    };

    return ok(
      {
        program: serializeProgram(updatedProgramData),
        disbursement: serializedDisbursement,
      },
      201,
    );
  } catch (err) {
    console.error("POST /api/programs/:id/disbursements error:", err);
    return fail("Gagal mencatat penyaluran dana.", 500);
  }
}
