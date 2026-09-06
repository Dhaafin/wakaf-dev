// Util format tampilan — Bahasa Indonesia.

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

/**
 * Format rupiah ringkas untuk kartu statistik / tampilan sempit (HP).
 * Contoh: 1_044_600_000 -> "Rp 1,04 miliar", 313_500_000 -> "Rp 313,5 juta",
 * 850_000 -> "Rp 850 ribu", 9_500 -> "Rp 9.500".
 */
export function formatRupiahCompact(n: number): string {
  const abs = Math.abs(n);
  const fmt = (val: number, suffix: string) => {
    const rounded = Math.round(val * 100) / 100;
    const str = rounded
      .toLocaleString("id-ID", { maximumFractionDigits: 2 })
      .replace(/,00$/, "");
    return `Rp ${str} ${suffix}`;
  };
  if (abs >= 1_000_000_000) return fmt(n / 1_000_000_000, "miliar");
  if (abs >= 1_000_000) return fmt(n / 1_000_000, "juta");
  if (abs >= 1_000) return fmt(n / 1_000, "ribu");
  return formatRupiah(n);
}

export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTanggalWaktu(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function persen(terkumpul: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((terkumpul / target) * 1000) / 10);
}

/** Ubah sisa milidetik menjadi { jam, menit, detik } tak-negatif. */
export function breakdownDuration(ms: number) {
  const clamped = Math.max(0, ms);
  const totalDetik = Math.floor(clamped / 1000);
  return {
    jam: Math.floor(totalDetik / 3600),
    menit: Math.floor((totalDetik % 3600) / 60),
    detik: totalDetik % 60,
    habis: clamped <= 0,
  };
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}
