import { type NextRequest } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { programs } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api/server";
import { eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/programs/:id/restore — pulihkan program yang terhapus (admin only)
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Verifikasi role admin
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    const identifier = decodeURIComponent(params.id);

    // 2. Cek keberadaan program (termasuk yang deletedAt != null)
    const existing = await db.query.programs.findFirst({
      where: or(eq(programs.id, identifier), eq(programs.slug, identifier)),
    });

    if (!existing) {
      return fail("Program tidak ditemukan.", 404);
    }

    if (!existing.deletedAt) {
      return fail("Program ini tidak berada di kotak sampah.", 400);
    }

    // 3. Restore: Hapus timestamp deletedAt & aktifkan kembali
    await db
      .update(programs)
      .set({
        deletedAt: null,
        aktif: true,
      })
      .where(eq(programs.id, existing.id));

    return ok({
      success: true,
      message: `Program "${existing.nama}" berhasil dipulihkan.`,
    });
  } catch (err) {
    console.error("POST /api/programs/[id]/restore error:", err);
    return fail("Gagal memulihkan program.", 500);
  }
}
