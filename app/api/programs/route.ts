import { type NextRequest } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { programs } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api/server";
import { validateProgramForm } from "@/lib/validation";
import { createId, slugify } from "@/lib/id";
import { serializeProgram } from "@/lib/db/serialize";
import { and, eq, isNull, ilike, or, desc, asc, sql } from "drizzle-orm";
import type { PaginatedResult, Program } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/programs — daftar program dengan pagination, search, filter & sort
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const type = searchParams.get("type")?.trim();
    const kategori = searchParams.get("kategori")?.trim();
    const status = searchParams.get("status")?.trim(); // 'all' | 'active' | 'inactive'
    const sort = searchParams.get("sort")?.trim() || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const offset = (page - 1) * limit;

    // Kondisi filter
    const conditions = [isNull(programs.deletedAt)];

    if (status === "inactive") {
      conditions.push(eq(programs.aktif, false));
    } else if (status !== "all") {
      // Default publik: hanya program aktif
      conditions.push(eq(programs.aktif, true));
    }

    if (type) {
      conditions.push(eq(programs.programType, type));
    }

    if (kategori) {
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
    if (sort === "oldest") {
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

    // Ambil data program lengkap dengan riwayat penyalurannya
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

    const result: PaginatedResult<Program> = {
      items: items.map(serializeProgram),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };

    return ok(result);
  } catch (err) {
    console.error("GET /api/programs error:", err);
    return fail("Gagal memuat daftar program.", 500);
  }
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


