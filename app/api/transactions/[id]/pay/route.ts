import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/api/server";
import { settleTransaction } from "@/lib/settlement";

export const dynamic = "force-dynamic";

// POST /api/transactions/:id/pay
// Simulasi pelunasan pembayaran / manual settlement (dibatasi admin / dev mode)
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = decodeURIComponent(resolvedParams.id);

    // Proteksi keamanan: hanya izinkan di mode dev/testing atau oleh Admin yang login
    const isDev = process.env.NODE_ENV !== "production";
    let isAdmin = false;
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      isAdmin = session?.user?.role === "admin";
    } catch {
      // abaikan bila session tidak ditemukan
    }

    if (!isDev && !isAdmin) {
      return fail(
        "Akses ditolak: Simulasi pembayaran hanya diizinkan untuk admin atau dalam lingkungan pengujian.",
        403,
      );
    }

    const settlement = await settleTransaction(id);

    return ok({
      transaction: settlement.transaction,
      certificate: settlement.certificate,
    });
  } catch (err) {
    console.error("POST /api/transactions/:id/pay error:", err);
    const msg =
      err instanceof Error ? err.message : "Gagal memperbarui status transaksi.";
    return fail(msg, 500);
  }
}
