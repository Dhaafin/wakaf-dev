import type {
  Program,
  Transaction,
  Certificate,
  DisbursementReport,
  GlobalStats,
} from "@/types";
import {
  SEED_PROGRAMS,
  SEED_TRANSACTIONS,
  SEED_CERTIFICATES,
  SEED_CERT_SEQ,
} from "./seed";

// ============================================================================
// MOCK DATABASE — in-memory store, hidup di sisi SERVER.
// ----------------------------------------------------------------------------
// CATATAN DEMO:
//  - Tidak ada database sungguhan. Data disimpan di memori proses Next.js
//    sehingga KONSISTEN walau halaman di-refresh dan bisa dibaca semua
//    halaman / user session selama server tidak di-restart.
//  - Disimpan pada globalThis agar tidak ter-reset oleh Hot Module Reload
//    saat `next dev`.
//  - Endpoint POST /api/reset mengembalikan seluruh isi store ke kondisi seed.
//  - Untuk produksi: ganti seluruh modul ini dengan koneksi DB sungguhan
//    (Prisma / Drizzle / dsb.) — signature fungsi di bawah bisa dipertahankan.
// ============================================================================

interface Store {
  programs: Program[];
  transactions: Transaction[];
  certificates: Certificate[];
  certSeq: number; // penghitung nomor sertifikat
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function buildSeedStore(): Store {
  return {
    programs: deepClone(SEED_PROGRAMS),
    transactions: deepClone(SEED_TRANSACTIONS),
    certificates: deepClone(SEED_CERTIFICATES),
    certSeq: SEED_CERT_SEQ,
  };
}

const GLOBAL_KEY = "__WAKAF_MOCK_DB__";

function getStore(): Store {
  const g = globalThis as unknown as Record<string, Store | undefined>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = buildSeedStore();
  }
  return g[GLOBAL_KEY]!;
}

export function resetStore(): void {
  const g = globalThis as unknown as Record<string, Store | undefined>;
  g[GLOBAL_KEY] = buildSeedStore();
}

// ------------------------------- util id ------------------------------------

const RAND_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randToken(len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += RAND_ALPHABET[Math.floor(Math.random() * RAND_ALPHABET.length)];
  }
  return s;
}

function ymd(d: Date): string {
  return (
    d.getFullYear().toString() +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    d.getDate().toString().padStart(2, "0")
  );
}

/** ID transaksi, mis. WKF-20260901-7QK2ZP */
export function makeTransactionId(): string {
  return `WKF-${ymd(new Date())}-${randToken(6)}`;
}

/**
 * Nomor Virtual Account mock — format realistis:
 * prefix "88808" (kode biller demo) + 11 digit acak. Total 16 digit.
 */
export function makeVaNumber(): string {
  let digits = "";
  for (let i = 0; i < 11; i++) digits += Math.floor(Math.random() * 10).toString();
  return `88808${digits}`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// ------------------------------ PROGRAMS -----------------------------------

export function listPrograms(): Program[] {
  return deepClone(getStore().programs);
}

export function getProgram(idOrSlug: string): Program | undefined {
  const p = getStore().programs.find(
    (x) => x.id === idOrSlug || x.slug === idOrSlug,
  );
  return p ? deepClone(p) : undefined;
}

export interface NewProgramInput {
  nama: string;
  kategori: Program["kategori"];
  program_type?: Program["program_type"];
  lokasi: string;
  ringkasan: string;
  deskripsi: string;
  imageUrl?: string;
  target: number;
  nazhir: string;
}

export function createProgram(input: NewProgramInput): Program {
  const store = getStore();
  const now = new Date().toISOString();
  const prog: Program = {
    id: `prg-${slugify(input.nama)}-${randToken(4).toLowerCase()}`,
    program_type: input.program_type ?? "wakaf",
    kategori: input.kategori,
    nama: input.nama,
    slug: slugify(input.nama),
    lokasi: input.lokasi,
    ringkasan: input.ringkasan,
    deskripsi: input.deskripsi,
    imageUrl:
      input.imageUrl && input.imageUrl.trim().length > 0
        ? input.imageUrl.trim()
        : "https://picsum.photos/seed/kbm-program-baru/1200/675",
    target: input.target,
    terkumpul: 0,
    jumlahWakif: 0,
    nazhir: input.nazhir,
    createdAt: now,
    aktif: true,
    disbursements: [],
  };
  store.programs.unshift(prog);
  return deepClone(prog);
}

export function addDisbursement(
  programId: string,
  input: {
    judul: string;
    deskripsi: string;
    nominal: number;
    buktiImageUrl?: string;
    buktiFileName?: string;
  },
): DisbursementReport | undefined {
  const store = getStore();
  const prog = store.programs.find((p) => p.id === programId);
  if (!prog) return undefined;
  const rec: DisbursementReport = {
    id: `dsb-${randToken(6).toLowerCase()}`,
    programId,
    tanggal: new Date().toISOString(),
    judul: input.judul,
    deskripsi: input.deskripsi,
    nominal: input.nominal,
    buktiImageUrl: input.buktiImageUrl,
    buktiFileName: input.buktiFileName,
  };
  prog.disbursements.unshift(rec);
  return deepClone(rec);
}

// ---------------------------- TRANSACTIONS --------------------------------

export function listTransactions(): Transaction[] {
  return deepClone(getStore().transactions).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getTransaction(id: string): Transaction | undefined {
  const t = getStore().transactions.find((x) => x.id === id);
  return t ? deepClone(t) : undefined;
}

export function listTransactionsByEmail(email: string): Transaction[] {
  const e = email.trim().toLowerCase();
  return deepClone(getStore().transactions)
    .filter((t) => t.emailWakif.toLowerCase() === e)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface NewTransactionInput {
  programId: string;
  nominal: number;
  namaWakif: string;
  emailWakif: string;
  teleponWakif: string;
  atasNama: Transaction["atasNama"];
  namaAtasNama?: string;
  visibilitas: Transaction["visibilitas"];
  doa?: string;
  bank?: string;
  /**
   * Durasi hidup VA sebelum expired, dalam milidetik.
   * DEMO: default dipercepat jadi 3 menit (lihat lib/config.ts).
   * Produksi: 24 jam.
   */
  ttlMs: number;
}

export function createTransaction(
  input: NewTransactionInput,
): Transaction | undefined {
  const store = getStore();
  const prog = store.programs.find((p) => p.id === input.programId);
  if (!prog) return undefined;

  const now = new Date();
  const tx: Transaction = {
    id: makeTransactionId(),
    program_type: prog.program_type,
    programId: prog.id,
    programNama: prog.nama,
    nominal: input.nominal,
    biayaAdmin: 0, // demo: tanpa biaya admin
    total: input.nominal,
    namaWakif: input.namaWakif,
    emailWakif: input.emailWakif,
    teleponWakif: input.teleponWakif,
    atasNama: input.atasNama,
    namaAtasNama:
      input.atasNama === "orang-lain" ? input.namaAtasNama : undefined,
    visibilitas: input.visibilitas,
    doa: input.doa,
    vaNumber: makeVaNumber(),
    bank: input.bank ?? "BSI",
    status: "pending",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + input.ttlMs).toISOString(),
  };
  store.transactions.unshift(tx);
  return deepClone(tx);
}

/**
 * Mock "webhook" pembayaran. Dipanggil API route /api/transactions/[id]/pay.
 * Efek samping: status -> paid, progres & jumlah wakif program bertambah,
 * sertifikat dibuat.
 */
export function markTransactionPaid(id: string):
  | { transaction: Transaction; certificate: Certificate }
  | { error: string } {
  const store = getStore();
  const tx = store.transactions.find((x) => x.id === id);
  if (!tx) return { error: "Transaksi tidak ditemukan" };
  if (tx.status === "paid") {
    const existing = store.certificates.find((c) => c.transactionId === tx.id);
    if (existing)
      return { transaction: deepClone(tx), certificate: deepClone(existing) };
  }
  if (tx.status === "expired") {
    return { error: "Transaksi sudah kedaluwarsa, silakan buat ulang" };
  }

  const now = new Date();
  tx.status = "paid";
  tx.paidAt = now.toISOString();

  // --- update data program terkait (dibaca dari store yang sama) ---
  const prog = store.programs.find((p) => p.id === tx.programId);
  if (prog) {
    prog.terkumpul += tx.nominal;
    // jumlah wakif bertambah 1 hanya jika email ini belum pernah paid di program ini
    const sudahPernah = store.transactions.some(
      (o) =>
        o.id !== tx.id &&
        o.programId === tx.programId &&
        o.status === "paid" &&
        o.emailWakif.toLowerCase() === tx.emailWakif.toLowerCase(),
    );
    if (!sudahPernah) prog.jumlahWakif += 1;
  }

  // --- generate sertifikat ---
  store.certSeq += 1;
  const seqStr = store.certSeq.toString().padStart(6, "0");
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const certId = `SW/${now.getFullYear()}/${mm}/${seqStr}`;
  const cert: Certificate = {
    id: certId,
    transactionId: tx.id,
    programId: tx.programId,
    programNama: tx.programNama,
    program_type: tx.program_type,
    namaPihak:
      tx.atasNama === "orang-lain" && tx.namaAtasNama
        ? tx.namaAtasNama
        : tx.namaWakif,
    nominal: tx.nominal,
    tanggal: now.toISOString(),
    nazhir: prog?.nazhir ?? "Nazhir Yayasan Khazanah Berkah Mulia",
  };
  tx.certificateId = certId;
  store.certificates.unshift(cert);

  return { transaction: deepClone(tx), certificate: deepClone(cert) };
}

/** Tandai transaksi kedaluwarsa (dipakai halaman tunggu saat countdown habis). */
export function markTransactionExpired(id: string): Transaction | { error: string } {
  const store = getStore();
  const tx = store.transactions.find((x) => x.id === id);
  if (!tx) return { error: "Transaksi tidak ditemukan" };
  if (tx.status === "paid") return { error: "Transaksi sudah dibayar" };
  tx.status = "expired";
  return deepClone(tx);
}

// ---------------------------- CERTIFICATES --------------------------------

export function getCertificate(id: string): Certificate | undefined {
  // id sertifikat mengandung "/", saat lewat URL biasanya di-encode.
  const decoded = decodeURIComponent(id);
  const c = getStore().certificates.find((x) => x.id === decoded);
  return c ? deepClone(c) : undefined;
}

export function listCertificates(): Certificate[] {
  return deepClone(getStore().certificates);
}

// ------------------------------- STATS -----------------------------------

export function getGlobalStats(): GlobalStats {
  const store = getStore();
  const paid = store.transactions.filter((t) => t.status === "paid");
  const emails = new Set(paid.map((t) => t.emailWakif.toLowerCase()));
  const totalTerkumpul = store.programs.reduce((s, p) => s + p.terkumpul, 0);
  const totalDisalurkan = store.programs.reduce(
    (s, p) => s + p.disbursements.reduce((ss, d) => ss + d.nominal, 0),
    0,
  );
  return {
    totalTerkumpul,
    totalWakif: emails.size,
    totalTransaksiPaid: paid.length,
    totalProgram: store.programs.length,
    totalDisalurkan,
  };
}
