import { formatRupiah } from "@/lib/format";
import type { TransactionStatsSummary } from "@/types";
import { AdminKpiSkeleton } from "@/components/molecules/AdminKpiSkeleton";

export interface AdminTransactionKpiCardsProps {
  statsSummary: TransactionStatsSummary;
  loading?: boolean;
}

export function AdminTransactionKpiCards({
  statsSummary,
  loading = false,
}: AdminTransactionKpiCardsProps) {
  if (loading) {
    return <AdminKpiSkeleton count={4} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* Card 1: Total Dana Terkumpul / Sah */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Dana Terkumpul
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
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-serif text-lg font-bold text-emerald-950 sm:text-xl truncate block">
            {formatRupiah(statsSummary.totalNominal)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-600/80">
          Dari {statsSummary.paidCount} transaksi lunas
        </p>
      </div>

      {/* Card 2: Total Semua Transaksi */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Total Transaksi
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
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
            {statsSummary.totalCount}
          </span>
          <span className="text-xs text-brand-500 font-medium">invoice</span>
        </div>
        <p className="mt-1 text-[11px] text-brand-400">Seluruh riwayat donasi</p>
      </div>

      {/* Card 3: Menunggu Pembayaran */}
      <div className="card p-4 sm:p-5 transition hover:border-amber-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Menunggu Bayar
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-amber-950 sm:text-3xl">
            {statsSummary.pendingCount}
          </span>
          <span className="text-xs text-amber-700 font-medium">menunggu</span>
        </div>
        <p className="mt-1 text-[11px] text-amber-600/80">Pending Virtual Account</p>
      </div>

      {/* Card 4: Kedaluwarsa */}
      <div className="card p-4 sm:p-5 transition hover:border-slate-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Kedaluwarsa
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-slate-400/20">
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            {statsSummary.expiredCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">expired</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">Tidak diselesaikan</p>
      </div>
    </div>
  );
}
