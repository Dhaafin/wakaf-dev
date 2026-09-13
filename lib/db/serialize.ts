import type {
  Program,
  DisbursementReport,
  ProgramType,
  ProgramCategory,
  Transaction,
  Certificate,
} from "@/types";

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

export function serializeTransaction(t: any): Transaction {
  return {
    id: t.id,
    program_type: (t.programType ?? t.program_type) as ProgramType,
    programId: t.programId,
    programNama: t.programNama,
    nominal: Number(t.nominal),
    biayaAdmin: Number(t.biayaAdmin ?? 0),
    total: Number(t.total),
    namaWakif: t.namaWakif,
    emailWakif: t.emailWakif,
    teleponWakif: t.teleponWakif,
    atasNama: t.atasNama,
    namaAtasNama: t.namaAtasNama ?? undefined,
    visibilitas: t.visibilitas,
    doa: t.doa ?? undefined,
    vaNumber: t.vaNumber,
    bank: t.bank,
    status: t.status,
    createdAt:
      t.createdAt instanceof Date
        ? t.createdAt.toISOString()
        : String(t.createdAt),
    expiresAt:
      t.expiresAt instanceof Date
        ? t.expiresAt.toISOString()
        : String(t.expiresAt),
    paidAt: t.paidAt
      ? t.paidAt instanceof Date
        ? t.paidAt.toISOString()
        : String(t.paidAt)
      : undefined,
    certificateId: t.certificateId ?? undefined,
    snapToken: t.snapToken ?? undefined,
    snapRedirectUrl: t.snapRedirectUrl ?? undefined,
  };
}

export function serializeCertificate(c: any): Certificate {
  return {
    id: c.id,
    transactionId: c.transactionId,
    programId: c.programId,
    programNama: c.programNama,
    program_type: (c.programType ?? c.program_type) as ProgramType,
    namaPihak: c.namaPihak,
    nominal: Number(c.nominal),
    tanggal:
      c.tanggal instanceof Date
        ? c.tanggal.toISOString()
        : String(c.tanggal),
    nazhir: c.nazhir,
  };
}
