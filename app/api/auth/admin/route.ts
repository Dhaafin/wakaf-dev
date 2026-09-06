import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/server";
import { DEMO_ADMIN } from "@/lib/config";

export const dynamic = "force-dynamic";

// POST /api/auth/admin  { email, password }
// ----------------------------------------------------------------------------
// MOCK AUTH admin. Satu akun di-hardcode di lib/config.ts (DEMO_ADMIN).
// Di produksi: user store + hash password + sesi/token + RBAC.
// ----------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Body tidak valid.", 400);
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (email !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
    return fail("Email atau kata sandi admin salah.", 401, {
      password: "Kredensial tidak cocok.",
    });
  }

  return ok({ email: DEMO_ADMIN.email, nama: DEMO_ADMIN.nama });
}
