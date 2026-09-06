// ============================================================================
// Tipe data domain — dipakai bersama antara mock backend (API routes) & client.
// Arsitektur modular: `program_type` disiapkan agar program zakat/donasi/qurban
// bisa ditambahkan tanpa mengubah struktur inti.
// ============================================================================

export type ProgramType = "wakaf" | "zakat" | "donasi" | "qurban";

export type ProgramCategory =
  | "masjid"
  | "pendidikan"
  | "produktif-umkm"
  | "sumur-air-bersih";

export const PROGRAM_CATEGORY_LABEL: Record<ProgramCategory, string> = {
  masjid: "Masjid & Rumah Ibadah",
  pendidikan: "Pendidikan",
  "produktif-umkm": "Wakaf Produktif (UMKM)",
  "sumur-air-bersih": "Sumur & Air Bersih",
};

export const PROGRAM_TYPE_LABEL: Record<ProgramType, string> = {
  wakaf: "Wakaf",
  zakat: "Zakat",
  donasi: "Donasi",
  qurban: "Qurban",
};

export interface DisbursementReport {
  id: string;
  programId: string;
  tanggal: string; // ISO
  judul: string;
  deskripsi: string;
  nominal: number;
  /** data URL gambar bukti (mock file upload dengan preview) */
  buktiImageUrl?: string;
  buktiFileName?: string;
}

export interface Program {
  id: string;
  program_type: ProgramType;
  kategori: ProgramCategory;
  nama: string;
  slug: string;
  lokasi: string; // kota, Indonesia
  ringkasan: string;
  deskripsi: string;
  imageUrl: string;
  target: number;
  terkumpul: number;
  jumlahWakif: number;
  nazhir: string; // pengelola wakaf
  createdAt: string; // ISO
  aktif: boolean;
  disbursements: DisbursementReport[];
}

export type TransactionStatus = "pending" | "paid" | "expired";

export type AtasNama = "sendiri" | "orang-lain";
export type Visibilitas = "publik" | "anonim";

export interface Transaction {
  id: string; // ID unik transaksi, mis. WKF-20260901-AB12CD
  program_type: ProgramType;
  programId: string;
  programNama: string;
  nominal: number;
  biayaAdmin: number;
  total: number;

  // data wakif
  namaWakif: string;
  emailWakif: string;
  teleponWakif: string;
  atasNama: AtasNama;
  namaAtasNama?: string; // diisi jika atasNama === "orang-lain"
  visibilitas: Visibilitas;
  doa?: string;

  // pembayaran (mock Virtual Account)
  vaNumber: string;
  bank: string;
  status: TransactionStatus;

  createdAt: string; // ISO
  expiresAt: string; // ISO — countdown dihitung dari sini
  paidAt?: string; // ISO

  certificateId?: string; // diisi saat status -> paid
}

export interface Certificate {
  id: string; // nomor sertifikat unik & bisa diverifikasi, mis. SW/2026/09/000123
  transactionId: string;
  programId: string;
  programNama: string;
  program_type: ProgramType;
  namaPihak: string; // nama yang tercantum di sertifikat (wakif atau atas nama)
  nominal: number;
  tanggal: string; // ISO
  nazhir: string;
}

export interface WakifSession {
  email: string;
  nama: string;
  loggedInAt: string;
}

export interface AdminSession {
  email: string;
  nama: string;
  loggedInAt: string;
}

export interface GlobalStats {
  totalTerkumpul: number;
  totalWakif: number; // jumlah wakif unik (by email) dari transaksi paid
  totalTransaksiPaid: number;
  totalProgram: number;
  totalDisalurkan: number;
}

/**
 * Proyeksi PUBLIK dari transaksi yang sudah lunas — untuk "wall of donors" di
 * halaman transparansi. Tidak memuat email/telepon. Nama disembunyikan bila
 * wakif memilih anonim.
 */
export interface PublicDonation {
  id: string;
  nama: string; // "Hamba Allah" bila anonim
  anonim: boolean;
  programId: string;
  programNama: string;
  program_type: ProgramType;
  nominal: number;
  doa?: string;
  paidAt: string; // ISO
}

// Bentuk respons API generik
export interface ApiOk<T> {
  ok: true;
  data: T;
}
export interface ApiErr {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
}
export type ApiResponse<T> = ApiOk<T> | ApiErr;
