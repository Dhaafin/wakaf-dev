import { formatRupiah } from "@/lib/format";
import { AdminKpiSkeleton } from "@/components/molecules/AdminKpiSkeleton";
import type { AdminAnalyticsData } from "@/types";

export interface AdminDashboardKpiCardsProps {
  overview: AdminAnalyticsData["overview"] | undefined;
  loading?: boolean;
}

export function AdminDashboardKpiCards({
  overview,
  loading = false,
}: AdminDashboardKpiCardsProps) {
  if (loading || !overview) {
    return <AdminKpiSkeleton count={4} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* Card 1: Dana Dihimpun (Inflow) */}
      <div className="card p-4 sm:p-5 transition hover:border-emerald-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Dana Dihimpun
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
            {formatRupiah(overview.totalTerkumpul)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-700/80">
          <span>{overview.totalWakif} wakif / donatur</span>
          <span className="font-medium text-brand-600">Rerata: {formatRupiah(overview.avgDonation)}</span>
        </div>
      </div>

      {/* Card 2: Dana Tersalurkan (Outflow) */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Dana Disalurkan
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
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-serif text-lg font-bold text-brand-950 sm:text-xl truncate block">
            {formatRupiah(overview.totalDisalurkan)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="text-brand-400">Realisasi ke mustahik</span>
          <span className="font-semibold text-accent-700 bg-accent-50 px-1.5 py-0.5 rounded text-[10px]">
            {overview.disbursementRatio}% tersalur
          </span>
        </div>
      </div>

      {/* Card 3: Saldo Kas Amanah Siap Salur */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Saldo Kas Amanah
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
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-serif text-lg font-bold text-brand-950 sm:text-xl truncate block">
            {formatRupiah(overview.saldoMengendap)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-brand-400">
          <span>Dana siap dialokasikan</span>
          <span className="text-emerald-600 font-medium">{overview.activeProgramCount} program aktif</span>
        </div>
      </div>

      {/* Card 4: Konversi Pembayaran */}
      <div className="card p-4 sm:p-5 transition hover:border-amber-300 hover:shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Efektivitas Konversi
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-amber-950 sm:text-3xl">
            {overview.conversionRate}%
          </span>
          <span className="text-xs text-amber-700 font-medium">sukses bayar</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-brand-500">
          <span className="text-emerald-700 font-semibold">{overview.paidTransactions} lunas</span>
          <span>•</span>
          <span className="text-amber-700">{overview.pendingTransactions} pending</span>
          <span>•</span>
          <span className="text-slate-500">{overview.expiredTransactions} expired</span>
        </div>
      </div>
    </div>
  );
}
