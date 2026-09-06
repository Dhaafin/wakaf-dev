import type { NextRequest } from "next/server";
import { addDisbursement, getProgram } from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";
import { validateDisbursementForm } from "@/lib/validation";

export const dynamic = "force-dynamic";

// POST /api/programs/:id/disbursements
// Tambah laporan penyaluran dana untuk sebuah program (dipakai admin panel).
// `buktiImageUrl` adalah data URL hasil mock file upload di browser.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const programId = decodeURIComponent(params.id);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Body tidak valid.", 400);
  }

  const values = {
    judul: String(body.judul ?? ""),
    deskripsi: String(body.deskripsi ?? ""),
    nominal: Number(body.nominal ?? 0),
    buktiImageUrl: String(body.buktiImageUrl ?? ""),
    buktiFileName: String(body.buktiFileName ?? ""),
  };

  const fieldErrors = validateDisbursementForm(values);
  if (Object.keys(fieldErrors).length > 0) {
    return fail("Periksa kembali isian form.", 422, fieldErrors);
  }

  const rec = addDisbursement(programId, {
    judul: values.judul.trim(),
    deskripsi: values.deskripsi.trim(),
    nominal: values.nominal,
    buktiImageUrl: values.buktiImageUrl,
    buktiFileName: values.buktiFileName || undefined,
  });
  if (!rec) return fail("Program tidak ditemukan.", 404);

  const program = getProgram(programId)!;
  return ok({ program, disbursement: rec }, 201);
}
