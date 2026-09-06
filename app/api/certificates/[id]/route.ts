import { getCertificate } from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";

export const dynamic = "force-dynamic";

// GET /api/certificates/:id — id sertifikat (mis. "SW/2026/09/000123") harus
// di-encode di URL karena mengandung "/".
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const cert = getCertificate(params.id);
  if (!cert) return fail("Sertifikat tidak ditemukan.", 404);
  return ok(cert);
}
