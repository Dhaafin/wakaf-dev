import { db } from "@/lib/db/client";
import { certificates } from "@/lib/db/schema";
import { ok, fail } from "@/lib/api/server";
import { serializeCertificate } from "@/lib/db/serialize";
import { getCertificate as getMockCertificate } from "@/lib/mock-db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/certificates/:id — id sertifikat (mis. "SW/2026/09/000123")
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const rawId = decodeURIComponent(params.id);

    // 1. Ambil dari database Neon PostgreSQL
    const cert = await db.query.certificates.findFirst({
      where: eq(certificates.id, rawId),
    });

    if (cert) {
      return ok(serializeCertificate(cert));
    }

    // 2. Fallback ke mock-db untuk data dummy terdahulu
    const mock = getMockCertificate(rawId);
    if (mock) {
      return ok(mock);
    }

    return fail("Sertifikat tidak ditemukan.", 404);
  } catch (err) {
    console.error("GET /api/certificates/:id error:", err);
    return fail("Gagal memuat data sertifikat.", 500);
  }
}

