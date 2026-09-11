import { formatRupiah } from "@/lib/format";

export interface AdminProgramKpiProps {
  total: number;
  statsSummary: {
    activeCount: number;
    totalTarget: number;
    totalTerkumpul: number;
    totalWakif: number;
    avgPct: number;
  };
}

export function AdminProgramKpiCards({ total, statsSummary }: AdminProgramKpiProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* Card 1: Total Program */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Total Program
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">{total}</span>
          <span className="text-xs text-brand-500 font-medium">program</span>
        </div>
        <p className="mt-1 text-[11px] text-brand-400">4 instrumen wakaf & zakat</p>
      </div>

      {/* Card 2: Program Aktif */}
      <div className="card p-4 sm:p-5 transition hover:border-emerald-300 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Sedang Aktif
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-emerald-950 sm:text-3xl">
            {statsSummary.activeCount}
          </span>
          <span className="text-xs text-emerald-700 font-medium">program</span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-600/80">Tampil di portal publik</p>
      </div>

      {/* Card 3: Total Dana Dihimpun */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Dana Terkumpul
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-50 text-accent-800 ring-1 ring-accent-600/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-serif text-lg font-bold text-brand-950 sm:text-xl truncate block">
            {formatRupiah(statsSummary.totalTerkumpul)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-brand-400">
          Rata-rata {statsSummary.avgPct}% dari target
        </p>
      </div>

      {/* Card 4: Total Donatur */}
      <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
            Donatur / Wakif
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-600/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
            {statsSummary.totalWakif.toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-brand-500 font-medium">wakif</span>
        </div>
        <p className="mt-1 text-[11px] text-brand-400">Partisipasi masyarakat</p>
      </div>
    </div>
  );
}
