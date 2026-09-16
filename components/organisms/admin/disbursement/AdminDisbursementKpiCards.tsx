import { formatRupiah } from "@/lib/format";
import type { DisbursementStatsSummary } from "@/types";
import { AdminKpiSkeleton } from "@/components/molecules/AdminKpiSkeleton";

export interface AdminDisbursementKpiProps {
  statsSummary: DisbursementStatsSummary;
  loading?: boolean;
}

export function AdminDisbursementKpiCards({
  statsSummary,
  loading = false,
}: AdminDisbursementKpiProps) {
  if (loading) {
    return <AdminKpiSkeleton count={4} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* Card 1: Total Dana Disalurkan */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Total Disalurkan
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-50 text-accent-800 ring-1 ring-accent-600/20">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-serif text-lg font-bold text-brand-950 sm:text-xl truncate block">
            {formatRupiah(statsSummary.totalNominal)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-brand-400">Realisasi dana umat</p>
      </div>

      {/* Card 2: Total Laporan / Kuitansi */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Laporan Realisasi
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
            {statsSummary.totalCount}
          </span>
          <span className="text-xs text-brand-500 font-medium">laporan</span>
        </div>
        <p className="mt-1 text-[11px] text-brand-400">Bukti & arsip kuitansi</p>
      </div>

      {/* Card 3: Program Terdampak */}
      <div className="card p-4 sm:p-5 transition hover:border-emerald-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Program Terdampak
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-emerald-950 sm:text-3xl">
            {statsSummary.programCount}
          </span>
          <span className="text-xs text-emerald-700 font-medium">program</span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-600/80">Menerima manfaat</p>
      </div>

      {/* Card 4: Rata-rata per Penyaluran */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Rata-rata Penyaluran
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-600/20">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-serif text-lg font-bold text-brand-950 sm:text-xl truncate block">
            {formatRupiah(statsSummary.avgNominal)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-brand-400">Rerata per transaksi</p>
      </div>
    </div>
  );
}
