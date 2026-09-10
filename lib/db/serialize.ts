import type { Program, DisbursementReport, ProgramType, ProgramCategory } from "@/types";

export function serializeProgram(p: any): Program {
  return {
    id: p.id,
    program_type: (p.programType ?? p.program_type) as ProgramType,
    kategori: p.kategori as ProgramCategory,
    nama: p.nama,
    slug: p.slug,
    lokasi: p.lokasi,
    ringkasan: p.ringkasan,
    deskripsi: p.deskripsi,
    imageUrl: p.imageUrl ?? "",
    target: Number(p.target),
    terkumpul: Number(p.terkumpul),
    jumlahWakif: Number(p.jumlahWakif),
    nazhir: p.nazhir,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
    aktif: Boolean(p.aktif),
    disbursements: (p.disbursements ?? []).map(
      (d: any): DisbursementReport => ({
        id: d.id,
        programId: d.programId,
        tanggal: d.tanggal instanceof Date ? d.tanggal.toISOString() : String(d.tanggal),
        judul: d.judul,
        deskripsi: d.deskripsi,
        nominal: Number(d.nominal),
        buktiImageUrl: d.buktiImageUrl ?? undefined,
        buktiFileName: d.buktiFileName ?? undefined,
      }),
    ),
  };
}
