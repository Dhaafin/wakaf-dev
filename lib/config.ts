// ============================================================================
// Konfigurasi khusus DEMO. Semua nilai yang "dipercepat" atau "dipalsukan"
// untuk keperluan presentasi dikumpulkan di sini agar mudah dicari & diganti
// saat naik ke implementasi produksi.
// ============================================================================

/**
 * Masa berlaku Virtual Account.
 * DEMO: 3 menit supaya skenario "countdown habis -> expired" bisa
 *       ditunjukkan di depan klien tanpa menunggu lama.
 * PRODUKSI: ganti ke 24 * 60 * 60 * 1000 (24 jam).
 */
export const VA_TTL_MS = 3 * 60 * 1000;

/** Label yang ditampilkan di UI untuk masa berlaku VA di atas. */
export const VA_TTL_LABEL = "3 menit (dipercepat untuk demo — aslinya 24 jam)";

/**
 * Rentang delay tiruan tiap "API call" (ms) agar transisi loading terasa
 * seperti memanggil backend sungguhan. Lihat lib/api/client.ts.
 */
export const MOCK_LATENCY_MIN = 500;
export const MOCK_LATENCY_MAX = 1500;

/** Nominal wakaf minimum yang diterima form. */
export const NOMINAL_MIN = 10_000;

/** Pilihan nominal cepat pada form wakaf. */
export const NOMINAL_PRESETS = [50_000, 100_000, 250_000, 500_000, 1_000_000];

/** Akun admin demo (hardcode — JANGAN dipakai di produksi). */
export const DEMO_ADMIN = {
  email: "admin@kbm.or.id",
  password: "admin123",
  nama: "Admin KBM",
};

/** Identitas yayasan — dipakai di header, footer, sertifikat, dsb. */
export const YAYASAN = {
  nama: "Yayasan Khazanah Berkah Mulia",
  singkatan: "KBM",
  tagline: "Wakaf Digital",
};

/** Kode OTP dummy yang selalu diterima pada login wakif. */
export const DEMO_OTP = "123456";

export const BANK_OPTIONS = ["BSI", "BCA", "Mandiri", "BNI", "BRI"] as const;
