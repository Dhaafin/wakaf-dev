import { NOMINAL_MIN } from "@/lib/config";

// Validasi dipakai bersama oleh form (client) & API route (server).

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^(\+?62|0)8[0-9]{7,12}$/;

export interface WakafFormValues {
  nominal: number | "";
  nama: string;
  email: string;
  telepon: string;
  atasNama: "sendiri" | "orang-lain";
  namaAtasNama: string;
  visibilitas: "publik" | "anonim";
  doa?: string;
  bank?: string;
}

export function validateWakafForm(
  v: Partial<WakafFormValues>,
): Record<string, string> {
  const e: Record<string, string> = {};

  const nominal = typeof v.nominal === "string" ? Number(v.nominal) : v.nominal;
  if (!nominal || Number.isNaN(nominal)) {
    e.nominal = "Nominal wakaf wajib diisi.";
  } else if (nominal < NOMINAL_MIN) {
    e.nominal = `Nominal minimum ${NOMINAL_MIN.toLocaleString("id-ID")} rupiah.`;
  } else if (nominal > 1_000_000_000) {
    e.nominal = "Nominal terlalu besar untuk demo ini.";
  }

  if (!v.nama || v.nama.trim().length < 3) {
    e.nama = "Nama lengkap minimal 3 karakter.";
  }

  if (!v.email || !EMAIL_RE.test(v.email.trim())) {
    e.email = "Format email tidak valid.";
  }

  if (!v.telepon || !PHONE_RE.test(v.telepon.trim())) {
    e.telepon = "Nomor HP tidak valid (contoh: 081234567890).";
  }

  if (v.atasNama === "orang-lain") {
    if (!v.namaAtasNama || v.namaAtasNama.trim().length < 3) {
      e.namaAtasNama = "Nama pihak yang diwakafkan wajib diisi.";
    }
  }

  return e;
}

export interface ProgramFormValues {
  nama: string;
  kategori: string;
  lokasi: string;
  ringkasan: string;
  deskripsi: string;
  imageUrl: string;
  target: number | "";
  nazhir: string;
}

export function validateProgramForm(
  v: Partial<ProgramFormValues>,
): Record<string, string> {
  const e: Record<string, string> = {};
  if (!v.nama || v.nama.trim().length < 5)
    e.nama = "Nama program minimal 5 karakter.";
  if (!v.kategori) e.kategori = "Kategori wajib dipilih.";
  if (!v.lokasi || v.lokasi.trim().length < 3)
    e.lokasi = "Lokasi wajib diisi.";
  if (!v.ringkasan || v.ringkasan.trim().length < 10)
    e.ringkasan = "Ringkasan minimal 10 karakter.";
  if (!v.deskripsi || v.deskripsi.trim().length < 20)
    e.deskripsi = "Deskripsi minimal 20 karakter.";
  const target = typeof v.target === "string" ? Number(v.target) : v.target;
  if (!target || Number.isNaN(target) || target < 1_000_000)
    e.target = "Target minimal Rp1.000.000.";
  if (!v.nazhir || v.nazhir.trim().length < 3)
    e.nazhir = "Nama nazhir/pengelola wajib diisi.";
  return e;
}

export interface DisbursementFormValues {
  judul: string;
  deskripsi: string;
  nominal: number | "";
  buktiImageUrl: string;
  buktiFileName: string;
}

export function validateDisbursementForm(
  v: Partial<DisbursementFormValues>,
): Record<string, string> {
  const e: Record<string, string> = {};
  if (!v.judul || v.judul.trim().length < 5)
    e.judul = "Judul penyaluran minimal 5 karakter.";
  if (!v.deskripsi || v.deskripsi.trim().length < 15)
    e.deskripsi = "Deskripsi minimal 15 karakter.";
  const nominal = typeof v.nominal === "string" ? Number(v.nominal) : v.nominal;
  if (!nominal || Number.isNaN(nominal) || nominal <= 0)
    e.nominal = "Nominal penyaluran wajib diisi.";
  if (!v.buktiImageUrl) e.buktiImageUrl = "Unggah 1 gambar bukti penyaluran.";
  return e;
}
