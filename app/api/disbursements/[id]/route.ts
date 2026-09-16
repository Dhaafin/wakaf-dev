import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { disbursements } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// DELETE /api/disbursements/:id
// Hapus laporan penyaluran dana (Admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return fail("Akses ditolak: Hanya admin yang diizinkan.", 403);
    }

    const id = decodeURIComponent(params.id);

    const existing = await db.query.disbursements.findFirst({
      where: eq(disbursements.id, id),
    });

    if (!existing) {
      return fail("Laporan penyaluran tidak ditemukan.", 404);
    }

    await db.delete(disbursements).where(eq(disbursements.id, id));

    return ok({
      success: true,
      message: "Laporan penyaluran berhasil dihapus.",
    });
  } catch (err) {
    console.error("DELETE /api/disbursements/:id error:", err);
    return fail("Gagal menghapus laporan penyaluran.", 500);
  }
}
