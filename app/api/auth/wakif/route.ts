import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/server";
import { DEMO_OTP } from "@/lib/config";
import { EMAIL_RE } from "@/lib/validation";
import { db } from "@/lib/db/client";
import { transactions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/auth/wakif  { email, otp }
// ----------------------------------------------------------------------------
// MOCK AUTH wakif. Tidak ada password. OTP dummy: selalu terima kode "123456"
// (lihat lib/config.ts -> DEMO_OTP). Di produksi: kirim OTP asli via SMS/email
// dan simpan sesi ber-token.
// ----------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Body tidak valid.", 400);
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const otp = String(body.otp ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Format email tidak valid.";
  if (otp !== DEMO_OTP)
    fieldErrors.otp = `Kode OTP salah. Untuk demo, gunakan ${DEMO_OTP}.`;
  if (Object.keys(fieldErrors).length > 0)
    return fail("Login gagal.", 401, fieldErrors);

  // Ambil nama dari transaksi terakhir wakif di database agar personal
  let nama = email.split("@")[0];
  try {
    const latestTx = await db.query.transactions.findFirst({
      where: eq(transactions.emailWakif, email),
      orderBy: [desc(transactions.createdAt)],
    });
    if (latestTx?.namaWakif) {
      nama = latestTx.namaWakif;
    }
  } catch (err) {
    console.warn("Gagal mengambil nama profil wakif:", err);
  }

  return ok({ email, nama });
}

