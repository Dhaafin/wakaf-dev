"use client";

import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import {
  AdminDashboardHeader,
  AdminDashboardKpiCards,
  AdminCashflowChart,
  AdminInstrumentPortfolio,
  AdminCampaignRadar,
  AdminDoaFeed,
} from "./dashboard";

export function AdminDashboardOrganism() {
  const { data, loading, error, lastUpdated, refetch } = useAdminAnalytics();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header Eksekutif */}
      <AdminDashboardHeader
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={refetch}
      />

      {/* Error Alert if any */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-red-600 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="font-semibold text-red-700 underline hover:text-red-900 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* 2. 4 Kartu Metrik Kunci (KPIs) */}
      <AdminDashboardKpiCards
        overview={data?.overview}
        loading={loading}
      />

      {/* 3. Visualisasi Arus Kas Bulanan (6 Bulan) */}
      <AdminCashflowChart
        data={data?.monthlyCashflow || []}
        loading={loading}
      />

      {/* 4. Portofolio Filantropi & Preferensi Pembayaran */}
      <AdminInstrumentPortfolio
        instruments={data?.instrumentDistribution || []}
        channels={data?.paymentChannels || []}
        loading={loading}
      />

      {/* 5. Radar Capaian Program & Akselerasi Pendanaan */}
      <AdminCampaignRadar
        topCampaigns={data?.topCampaigns || []}
        needHelpCampaigns={data?.needHelpCampaigns || []}
        loading={loading}
      />

      {/* 6. Untaian Doa & Aspirasi Donatur */}
      <AdminDoaFeed
        items={data?.recentDoa || []}
        loading={loading}
      />
    </div>
  );
}
