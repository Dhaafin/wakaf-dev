import { type NextRequest } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { programs } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api/server";
import { validateProgramForm } from "@/lib/validation";
import { serializeProgram } from "@/lib/db/serialize";
import { and, eq, isNull, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/programs/:id — id boleh berupa id unik (prg_...) atau slug publik
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const identifier = decodeURIComponent(params.id);

    const prog = await db.query.programs.findFirst({
      where: and(
        or(eq(programs.id, identifier), eq(programs.slug, identifier)),
        isNull(programs.deletedAt),
      ),
      with: {
        disbursements: {
          orderBy: (d, { desc }) => [desc(d.tanggal)],
        },
      },
    });

    if (!prog) return fail("Program tidak ditemukan.", 404);
    return ok(serializeProgram(prog));
  } catch (err) {
    console.error("GET /api/programs/[id] error:", err);
    return fail("Gagal memuat detail program.", 500);
  }
}

// PUT /api/programs/:id — perbarui data program (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Verifikasi role admin via Better Auth session cookie
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    // 2. Cek keberadaan program
    const identifier = decodeURIComponent(params.id);
    const existing = await db.query.programs.findFirst({
      where: and(
        or(eq(programs.id, identifier), eq(programs.slug, identifier)),
        isNull(programs.deletedAt),
      ),
    });

    if (!existing) {
      return fail("Program tidak ditemukan.", 404);
    }

    // 3. Parse & validasi body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return fail("Body tidak valid.", 400);
    }

    const values = {
      nama: body.nama !== undefined ? String(body.nama) : existing.nama,
      kategori:
        body.kategori !== undefined ? String(body.kategori) : existing.kategori,
      lokasi: body.lokasi !== undefined ? String(body.lokasi) : existing.lokasi,
      ringkasan:
        body.ringkasan !== undefined
          ? String(body.ringkasan)
          : existing.ringkasan,
      deskripsi:
        body.deskripsi !== undefined
          ? String(body.deskripsi)
          : existing.deskripsi,
      imageUrl:
        body.imageUrl !== undefined
          ? String(body.imageUrl)
          : (existing.imageUrl ?? ""),
      target: body.target !== undefined ? Number(body.target) : existing.target,
      nazhir:
        body.nazhir !== undefined ? String(body.nazhir) : existing.nazhir,
    };

    const fieldErrors = validateProgramForm(values);
    if (Object.keys(fieldErrors).length > 0) {
      return fail("Periksa kembali isian form.", 422, fieldErrors);
    }

    // 4. Update data ke database (terlindungi: terkumpul & jumlahWakif tidak dimutasi manual)
    const [updated] = await db
      .update(programs)
      .set({
        nama: values.nama.trim(),
        programType: body.program_type
          ? String(body.program_type)
          : existing.programType,
        kategori: values.kategori.trim(),
        lokasi: values.lokasi.trim(),
        ringkasan: values.ringkasan.trim(),
        deskripsi: values.deskripsi.trim(),
        imageUrl: values.imageUrl.trim() || null,
        target: values.target,
        nazhir: values.nazhir.trim(),
        aktif: typeof body.aktif === "boolean" ? body.aktif : existing.aktif,
      })
      .where(eq(programs.id, existing.id))
      .returning();

    return ok(serializeProgram(updated));
  } catch (err) {
    console.error("PUT /api/programs/[id] error:", err);
    return fail("Gagal memperbarui program.", 500);
  }
}

// DELETE /api/programs/:id — soft delete program (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Verifikasi role admin via Better Auth session cookie
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    // 2. Cek keberadaan program
    const identifier = decodeURIComponent(params.id);
    const existing = await db.query.programs.findFirst({
      where: and(
        or(eq(programs.id, identifier), eq(programs.slug, identifier)),
        isNull(programs.deletedAt),
      ),
    });

    if (!existing) {
      return fail("Program tidak ditemukan.", 404);
    }

    // 3. Soft delete dengan mencatat deletedAt & menonaktifkan program
    await db
      .update(programs)
      .set({
        deletedAt: new Date(),
        aktif: false,
      })
      .where(eq(programs.id, existing.id));

    return ok({ success: true, message: "Program berhasil dihapus." });
  } catch (err) {
    console.error("DELETE /api/programs/[id] error:", err);
    return fail("Gagal menghapus program.", 500);
  }
}

