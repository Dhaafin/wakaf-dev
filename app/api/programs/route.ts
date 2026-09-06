import type { NextRequest } from "next/server";
import { listPrograms, createProgram } from "@/lib/mock-db";
import { ok, fail } from "@/lib/api/server";
import { validateProgramForm } from "@/lib/validation";
import type { ProgramCategory, ProgramType } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/programs — daftar semua program (publik).
export async function GET() {
  return ok(listPrograms());
}

// POST /api/programs — buat program baru (dipakai admin panel).
// Modular: `program_type` bisa dikirim (default "wakaf") untuk zakat/donasi dsb.
export async function POST(req: NextRequest) {
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

  const prog = createProgram({
    nama: values.nama.trim(),
    kategori: values.kategori as ProgramCategory,
    program_type: (body.program_type as ProgramType) ?? "wakaf",
    lokasi: values.lokasi.trim(),
    ringkasan: values.ringkasan.trim(),
    deskripsi: values.deskripsi.trim(),
    imageUrl: values.imageUrl.trim(),
    target: values.target,
    nazhir: values.nazhir.trim(),
  });

  return ok(prog, 201);
}
