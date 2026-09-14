"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import type { MonthlyCashflowItem } from "@/types";
import { Skeleton } from "@/components/atoms/Skeleton";

export interface AdminCashflowChartProps {
  data: MonthlyCashflowItem[];
  loading?: boolean;
}

export function AdminCashflowChart({
  data,
  loading = false,
}: AdminCashflowChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  // Cari nilai maksimum untuk normalisasi tinggi grafik
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.inflow, d.outflow)),
    1000000,
  );

  const total6MonthInflow = data.reduce((acc, curr) => acc + curr.inflow, 0);
  const total6MonthOutflow = data.reduce((acc, curr) => acc + curr.outflow, 0);

  return (
    <div className="card p-5 sm:p-6 shadow-xs border border-brand-200/90 bg-white space-y-5">
      {/* Header & Legend */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-brand-100/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-base font-bold text-brand-950 sm:text-lg">
              Arus Kas & Realisasi 6 Bulan Terakhir
            </h2>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
              Bulanan
            </span>
          </div>
          <p className="text-xs text-brand-500 mt-0.5">
            Perbandingan dana penghimpunan masuk (inflow) vs realisasi penyaluran amanah (outflow).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-600 shadow-xs" />
            <span className="font-medium text-brand-800 text-[11px]">Dana Masuk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-accent-600 shadow-xs" />
            <span className="font-medium text-brand-800 text-[11px]">Dana Tersalurkan</span>
          </div>
        </div>
      </div>

      {/* Chart Visualizer Bars */}
      <div className="relative pt-6 pb-2">
        <div className="grid grid-cols-6 gap-2 sm:gap-6 h-52 items-end">
          {data.map((item, idx) => {
            const inflowHeight = Math.max(6, Math.round((item.inflow / maxVal) * 100));
            const outflowHeight = Math.max(6, Math.round((item.outflow / maxVal) * 100));
            const isHovered = activeIdx === idx;

            return (
              <div
                key={item.monthKey}
                className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {/* Tooltip Hover Bubble */}
                {isHovered && (
                  <div className="absolute -top-16 z-30 flex flex-col items-center pointer-events-none animate-fade-in">
                    <div className="rounded-xl bg-brand-950 px-3 py-2 text-white shadow-xl text-[10px] space-y-1 min-w-[130px] border border-white/10">
                      <p className="font-bold text-brand-200 border-b border-white/10 pb-1">
                        {item.monthLabel}
                      </p>
                      <div className="flex justify-between gap-2 text-emerald-400">
                        <span>Masuk:</span>
                        <span className="font-semibold font-mono">{formatRupiah(item.inflow)}</span>
                      </div>
                      <div className="flex justify-between gap-2 text-accent-400">
                        <span>Salur:</span>
                        <span className="font-semibold font-mono">{formatRupiah(item.outflow)}</span>
                      </div>
                      <div className="text-white/60 text-[9px] pt-0.5">
                        {item.transactionCount} transaksi
                      </div>
                    </div>
                    <div className="h-1.5 w-1.5 rotate-45 bg-brand-950 -mt-1" />
                  </div>
                )}

                {/* Double Bar Container */}
                <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2.5 h-44 px-1 rounded-xl group-hover:bg-sand-50/80 transition-colors">
                  {/* Inflow Bar */}
                  <div
                    style={{ height: `${inflowHeight}%` }}
                    className={`w-3.5 sm:w-5 rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? "bg-emerald-500 shadow-md ring-2 ring-emerald-300"
                        : "bg-emerald-600/90"
                    }`}
                    title={`Masuk: ${formatRupiah(item.inflow)}`}
                  />

                  {/* Outflow Bar */}
                  <div
                    style={{ height: `${outflowHeight}%` }}
                    className={`w-3.5 sm:w-5 rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? "bg-accent-500 shadow-md ring-2 ring-accent-300"
                        : "bg-accent-600/80"
                    }`}
                    title={`Salur: ${formatRupiah(item.outflow)}`}
                  />
                </div>

                {/* Month Label */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[11px] font-semibold transition-colors block ${
                      isHovered ? "text-brand-950 font-bold" : "text-brand-500"
                    }`}
                  >
                    {item.monthLabel.split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-brand-400 block font-mono">
                    {item.monthLabel.split(" ")[1]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer 6-Month Aggregate Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-brand-100/80 text-xs">
        <div className="flex items-center justify-between rounded-xl bg-emerald-50/60 p-3 border border-emerald-100">
          <span className="text-emerald-800 font-medium">Akumulasi Penghimpunan 6 Bulan:</span>
          <span className="font-serif font-bold text-emerald-950 text-sm">
            {formatRupiah(total6MonthInflow)}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-accent-50/60 p-3 border border-accent-100">
          <span className="text-accent-900 font-medium">Akumulasi Penyaluran 6 Bulan:</span>
          <span className="font-serif font-bold text-accent-950 text-sm">
            {formatRupiah(total6MonthOutflow)}
          </span>
        </div>
      </div>
    </div>
  );
}
