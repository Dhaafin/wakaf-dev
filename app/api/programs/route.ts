import { type NextRequest } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { programs, transactions, disbursements } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api/server";
import { validateProgramForm } from "@/lib/validation";
import { createId, slugify } from "@/lib/id";
import { serializeProgram } from "@/lib/db/serialize";
import { and, eq, isNull, isNotNull, ilike, or, desc, asc, sql, inArray } from "drizzle-orm";
import type { PaginatedResult, Program, CategoryMeta } from "@/types";
import { PROGRAM_CATEGORY_LABEL } from "@/types";

export const dynamic = "force-dynamic";

import { listPrograms as getMockPrograms } from "@/lib/mock-db";

function getMockFilteredPrograms({
  q,
  type,
  kategori,
  status,
  sort,
  page,
  limit,
}: {
  q?: string;
  type?: string;
  kategori?: string;
  status?: string;
  sort?: string;
  page: number;
  limit: number;
}): PaginatedResult<Program> {
  let all = getMockPrograms();

  if (status === "inactive") {
    all = all.filter((p) => p.aktif === false);
  } else if (status !== "all") {
    all = all.filter((p) => p.aktif === true);
  }

  if (type) {
    all = all.filter((p) => p.program_type === type);
  }

  // Hitung jumlah program aktif per kategori secara dinamis
  const categoryCounts: Record<string, number> = {};
  all.forEach((p) => {
    categoryCounts[p.kategori] = (categoryCounts[p.kategori] || 0) + 1;
  });

  const categories: CategoryMeta[] = [
    { key: "semua", label: "Semua Kategori", count: all.length },
    ...Object.entries(PROGRAM_CATEGORY_LABEL).map(([key, label]) => ({
      key,
      label,
      count: categoryCounts[key] || 0,
    })),
  ];

  if (kategori && kategori !== "semua") {
    all = all.filter((p) => p.kategori === kategori);
  }

  if (q) {
    const lq = q.toLowerCase();
    all = all.filter(
      (p) =>
        p.nama.toLowerCase().includes(lq) ||
        p.ringkasan.toLowerCase().includes(lq) ||
        p.lokasi.toLowerCase().includes(lq),
    );
  }

  if (sort === "popular") {
    all.sort((a, b) => b.jumlahWakif - a.jumlahWakif || b.terkumpul - a.terkumpul);
  } else if (sort === "urgent") {
    all.sort((a, b) => (a.target > 0 ? a.terkumpul / a.target : 0) - (b.target > 0 ? b.terkumpul / b.target : 0));
  } else if (sort === "near_goal") {
    all.sort((a, b) => (b.target > 0 ? b.terkumpul / b.target : 0) - (a.target > 0 ? a.terkumpul / a.target : 0));
  } else if (sort === "oldest") {
    all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } else if (sort === "target_asc") {
    all.sort((a, b) => a.target - b.target);
  } else if (sort === "target_desc") {
    all.sort((a, b) => b.target - a.target);
  } else {
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const total = all.length;
  const offset = (page - 1) * limit;
  const items = all.slice(offset, offset + limit);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      deletedCount: 0,
    },
    categories,
  };
}

// GET /api/programs — daftar program dengan pagination, search, filter & sort
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type")?.trim();
  const kategori = searchParams.get("kategori")?.trim();
  const status = searchParams.get("status")?.trim(); // 'all' | 'active' | 'inactive' | 'deleted'
  const sort = searchParams.get("sort")?.trim() || "latest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const offset = (page - 1) * limit;

  try {
    if (process.env.DATABASE_URL) {
      // Hitung total program di tong sampah
      const [deletedCountRes] = await db
        .select({ count: sql`count(*)` })
        .from(programs)
        .where(isNotNull(programs.deletedAt));
      const deletedCount = Number(deletedCountRes?.count || 0);

      // Kondisi filter
      const conditions = [];

      if (status === "deleted") {
        conditions.push(isNotNull(programs.deletedAt));
      } else {
        conditions.push(isNull(programs.deletedAt));
        if (status === "inactive") {
          conditions.push(eq(programs.aktif, false));
        } else if (status !== "all") {
          // Default publik: hanya program aktif
          conditions.push(eq(programs.aktif, true));
        }
      }

      if (type) {
        conditions.push(eq(programs.programType, type));
      }

      if (kategori && kategori !== "semua") {
        conditions.push(eq(programs.kategori, kategori));
      }

      if (q) {
        const searchPattern = `%${q}%`;
        conditions.push(
          or(
            ilike(programs.nama, searchPattern),
            ilike(programs.ringkasan, searchPattern),
            ilike(programs.lokasi, searchPattern),
          )!,
        );
      }

      // Urutan sorting
      let orderBy = desc(programs.createdAt);
      if (sort === "popular") {
        orderBy = desc(programs.jumlahWakif);
      } else if (sort === "urgent") {
        orderBy = asc(programs.terkumpul);
      } else if (sort === "near_goal") {
        orderBy = desc(programs.terkumpul);
      } else if (sort === "oldest") {
        orderBy = asc(programs.createdAt);
      } else if (sort === "target_asc") {
        orderBy = asc(programs.target);
      } else if (sort === "target_desc") {
        orderBy = desc(programs.target);
      }

      // Hitung total data
      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(programs)
        .where(and(...conditions));
      const total = Number(countResult?.count ?? 0);

      if (total > 0) {
        const items = await db.query.programs.findMany({
          where: and(...conditions),
          orderBy,
          limit,
          offset,
          with: {
            disbursements: {
              orderBy: (d, { desc: descOrder }) => [descOrder(d.tanggal)],
            },
          },
        });

        const fallbackCategories = getMockFilteredPrograms({ q, type, status, page: 1, limit: 100 }).categories;

        const result: PaginatedResult<Program> = {
          items: items.map(serializeProgram),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            deletedCount,
          },
          categories: fallbackCategories,
        };

        return ok(result);
      }
    }
  } catch (err) {
    console.warn("GET /api/programs DB query failed, falling back to mock DB:", err);
  }

  // Fallback ke mock-db agar halaman tidak pernah kosong / 500 saat DB belum dikonfigurasi
  const fallbackResult = getMockFilteredPrograms({ q, type, kategori, status, sort, page, limit });
  return ok(fallbackResult);
}

// POST /api/programs — buat program baru (admin only)
export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi role admin via Better Auth session cookie
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    // 2. Parse & validasi body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return fail("Body tidak valid.", 400);
    }

    const values = {
      nama: String(body.nama ?? ""),
      kategori: String(body.kategori ?? ""),
      lokasi: String(body.lokasi ?? ""),
      ringkasan: String(body.ringkasan ?? ""),
      deskripsi: String(body.deskripsi ?? ""),
      imageUrl: String(body.imageUrl ?? ""),
      target: Number(body.target ?? 0),
      nazhir: String(body.nazhir ?? ""),
    };

    const fieldErrors = validateProgramForm(values);
    if (Object.keys(fieldErrors).length > 0) {
      return fail("Periksa kembali isian form.", 422, fieldErrors);
    }

    // 3. Generate slug & cegah duplikasi
    let baseSlug = slugify(values.nama);
    if (!baseSlug) baseSlug = createId("prg", 8);

    let finalSlug = baseSlug;
    const existingSlug = await db.query.programs.findFirst({
      where: eq(programs.slug, finalSlug),
    });
    if (existingSlug) {
      finalSlug = `${baseSlug}-${createId("prg", 4)}`;
    }

    // 4. Simpan ke database Neon PostgreSQL
    const newId = createId("prg");
    const [created] = await db
      .insert(programs)
      .values({
        id: newId,
        nama: values.nama.trim(),
        slug: finalSlug,
        programType: String(body.program_type ?? "wakaf-melalui-uang"),
        kategori: values.kategori.trim(),
        lokasi: values.lokasi.trim(),
        ringkasan: values.ringkasan.trim(),
        deskripsi: values.deskripsi.trim(),
        imageUrl: values.imageUrl.trim() || null,
        target: values.target,
        terkumpul: 0,
        jumlahWakif: 0,
        nazhir: values.nazhir.trim() || "Nazhir Yayasan Khazanah Berkah Mulia",
        aktif: true,
      })
      .returning();

    return ok(serializeProgram(created), 201);
  } catch (err) {
    console.error("POST /api/programs error:", err);
    return fail("Gagal membuat program.", 500);
  }
}

// DELETE /api/programs — bulk soft delete atau permanent delete programs (admin only)
export async function DELETE(req: NextRequest) {
  try {
    // 1. Verifikasi role admin via Better Auth session cookie
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    const { searchParams } = new URL(req.url);
    const isPermanent = searchParams.get("permanent") === "true";

    // 2. Parse body { ids: string[] }
    let body: { ids?: unknown };
    try {
      body = await req.json();
    } catch {
      return fail("Body JSON tidak valid.", 400);
    }

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return fail("Daftar ID program tidak valid atau kosong.", 400);
    }

    const validIds = body.ids.filter(
      (id): id is string => typeof id === "string" && id.trim().length > 0,
    );
    if (validIds.length === 0) {
      return fail("Daftar ID program tidak valid.", 400);
    }

    // 3. Aksi Hapus Permanen Massal
    if (isPermanent) {
      // Periksa apakah ada program yang memiliki riwayat transaksi
      const txPrograms = await db
        .select({ programId: transactions.programId })
        .from(transactions)
        .where(inArray(transactions.programId, validIds));

      const idsWithTx = new Set(txPrograms.map((t) => t.programId));
      const safeToDeleteIds = validIds.filter((id) => !idsWithTx.has(id));

      if (safeToDeleteIds.length === 0) {
        return fail(
          "Semua program terpilih tidak dapat dihapus permanen karena memiliki riwayat transaksi/keuangan.",
          400,
        );
      }

      // Bersihkan penyaluran terkait bila ada
      await db
        .delete(disbursements)
        .where(inArray(disbursements.programId, safeToDeleteIds));

      // Hapus baris program secara permanen
      const deleted = await db
        .delete(programs)
        .where(inArray(programs.id, safeToDeleteIds))
        .returning({ id: programs.id });

      const count = deleted.length;
      const skippedCount = validIds.length - safeToDeleteIds.length;

      const message =
        skippedCount > 0
          ? `${count} program berhasil dihapus permanen. ${skippedCount} program dilewati karena memiliki riwayat transaksi.`
          : `${count} program berhasil dihapus secara permanen.`;

      return ok({
        success: true,
        count,
        message,
      });
    }

    // 4. Soft delete dengan mencatat deletedAt & menonaktifkan program
    const deleted = await db
      .update(programs)
      .set({
        deletedAt: new Date(),
        aktif: false,
      })
      .where(and(inArray(programs.id, validIds), isNull(programs.deletedAt)))
      .returning({ id: programs.id });

    return ok({
      success: true,
      count: deleted.length,
      message: `${deleted.length} program berhasil dipindahkan ke kotak sampah.`,
    });
  } catch (err) {
    console.error("DELETE /api/programs bulk error:", err);
    return fail("Gagal menghapus program secara massal.", 500);
  }
}


