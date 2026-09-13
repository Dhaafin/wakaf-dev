// ============================================================================
// Tipe data domain — dipakai bersama antara mock backend (API routes) & client.
//
// `program_type` adalah SUMBU UTAMA pengelompokan program, mengikuti pembagian
// yang lazim dipakai lembaga wakaf (rujukan: wakafmulia.org) + zakat:
//   - wakaf-uang         : uangnya jadi objek wakaf; pokok dijaga, hasil
//                          pengelolaannya yang disalurkan (dana abadi).
//   - wakaf-melalui-uang : uang langsung diwujudkan jadi aset wakaf
//                          (tanah, masjid, sumur, gedung).
//   - infaq-shadaqah     : sedekah sukarela, disalurkan langsung.
//   - zakat              : kewajiban, terikat nisab/haul & 8 asnaf.
// Rujukan definisi: https://www.bwi.go.id/literasiwakaf/perbedaan-wakaf-uang-dan-wakaf-melalui-uang/
//
// `kategori` tetap ada sebagai klasifikasi sekunder (peruntukan program).
// ============================================================================

export type ProgramType =
  | "wakaf-uang"
  | "wakaf-melalui-uang"
  | "infaq-shadaqah"
  | "zakat";

/** Urutan tampil seksi di halaman /program. */
export const PROGRAM_TYPE_ORDER: ProgramType[] = [
  "wakaf-uang",
  "wakaf-melalui-uang",
  "infaq-shadaqah",
  "zakat",
];

export const PROGRAM_TYPE_LABEL: Record<ProgramType, string> = {
  "wakaf-uang": "Wakaf Uang",
  "wakaf-melalui-uang": "Wakaf Melalui Uang",
  "infaq-shadaqah": "Infaq & Shadaqah",
  zakat: "Zakat",
};

/** Penjelasan singkat yang tampil di bawah judul tiap seksi. */
export const PROGRAM_TYPE_DESC: Record<ProgramType, string> = {
  "wakaf-uang":
    "Uang Anda menjadi dana abadi. Pokoknya dijaga selamanya dan dikelola secara produktif — hasil pengelolaannya yang disalurkan untuk penerima manfaat.",
  "wakaf-melalui-uang":
    "Uang Anda langsung diwujudkan menjadi aset wakaf — tanah, bangunan masjid, sumur, atau sarana pendidikan — yang manfaatnya mengalir terus.",
  "infaq-shadaqah":
    "Sedekah sukarela yang disalurkan langsung kepada penerima manfaat. Tanpa batas minimal dan tanpa ketentuan khusus.",
  zakat:
    "Menunaikan kewajiban zakat sesuai nisab dan haul. Dana disalurkan kepada 8 golongan (asnaf) yang berhak menerimanya.",
};

/**
 * Kamus istilah per jenis program. Wakaf, infaq, dan zakat memakai sebutan
 * yang berbeda untuk pemberi, pengelola, dan bukti transaksinya — dipakai di
 * form, sertifikat, riwayat, dan halaman transparansi agar tidak rancu.
 */
export interface TypeTerms {
  /** Sebutan untuk pemberi dana. */
  pemberi: string;
  /** Sebutan jamak/kolektif, mis. "wakif" -> "wakif". */
  pemberiJamak: string;
  /** Sebutan pengelola dana. */
  pengelola: string;
  /** Label tombol aksi utama. */
  cta: string;
  /** Kata kerja untuk narasi, mis. "menunaikan wakaf". */
  kataKerja: string;
  /** Nama dokumen bukti yang diterbitkan setelah lunas. */
  bukti: string;
  /** Judul form pada halaman detail program. */
  judulForm: string;
}

export const PROGRAM_TYPE_TERMS: Record<ProgramType, TypeTerms> = {
  "wakaf-uang": {
    pemberi: "Wakif",
    pemberiJamak: "wakif",
    pengelola: "Nazhir",
    cta: "Wakaf Sekarang",
    kataKerja: "menunaikan wakaf uang",
    bukti: "Sertifikat Wakaf",
    judulForm: "Tunaikan wakaf uang",
  },
  "wakaf-melalui-uang": {
    pemberi: "Wakif",
    pemberiJamak: "wakif",
    pengelola: "Nazhir",
    cta: "Wakaf Sekarang",
    kataKerja: "menunaikan wakaf melalui uang",
    bukti: "Sertifikat Wakaf",
    judulForm: "Tunaikan wakaf",
  },
  "infaq-shadaqah": {
    pemberi: "Donatur",
    pemberiJamak: "donatur",
    pengelola: "Lembaga penyalur",
    cta: "Donasi Sekarang",
    kataKerja: "berinfaq/bersedekah",
    bukti: "Bukti Donasi",
    judulForm: "Salurkan infaq & shadaqah",
  },
  zakat: {
    pemberi: "Muzakki",
    pemberiJamak: "muzakki",
    pengelola: "Amil",
    cta: "Bayar Zakat",
    kataKerja: "menunaikan zakat",
    bukti: "Bukti Setor Zakat",
    judulForm: "Tunaikan zakat",
  },
};

export type ProgramCategory =
  | "masjid"
  | "pendidikan"
  | "produktif-umkm"
  | "sumur-air-bersih"
  | "kemanusiaan"
  | "sosial-dhuafa";

export const PROGRAM_CATEGORY_LABEL: Record<ProgramCategory, string> = {
  masjid: "Masjid & Rumah Ibadah",
  pendidikan: "Pendidikan",
  "produktif-umkm": "Produktif (UMKM)",
  "sumur-air-bersih": "Sumur & Air Bersih",
  kemanusiaan: "Kemanusiaan",
  "sosial-dhuafa": "Sosial & Dhuafa",
};

export interface DisbursementReport {
  id: string;
  programId: string;
  tanggal: string; // ISO
  judul: string;
  deskripsi: string;
  nominal: number;
  /** data URL atau Vercel Blob URL gambar bukti */
  buktiImageUrl?: string;
  buktiFileName?: string;
}

export interface DisbursementWithProgram extends DisbursementReport {
  program?: {
    id: string;
    nama: string;
    slug: string;
    kategori: ProgramCategory;
    programType: ProgramType;
    terkumpul: number;
    target: number;
  };
}

export interface DisbursementStatsSummary {
  totalNominal: number;
  totalCount: number;
  programCount: number;
  avgNominal: number;
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
  snapToken?: string;
  snapRedirectUrl?: string;
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

// Tipe Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

