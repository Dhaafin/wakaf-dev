"use client";

import { formatRupiah } from "@/lib/format";
import type { InstrumentDistributionItem, PaymentChannelItem } from "@/types";
import { Skeleton } from "@/components/atoms/Skeleton";

export interface AdminInstrumentPortfolioProps {
  instruments: InstrumentDistributionItem[];
  channels: PaymentChannelItem[];
  loading?: boolean;
}

const INSTRUMENT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  wakaf_uang: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    bar: "bg-emerald-600",
  },
  wakaf_melalui_uang: {
    bg: "bg-brand-50",
    text: "text-brand-800",
    bar: "bg-brand-600",
  },
  infaq_shadaqah: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    bar: "bg-amber-600",
  },
  zakat: {
    bg: "bg-sky-50",
    text: "text-sky-800",
    bar: "bg-sky-600",
  },
};

export function AdminInstrumentPortfolio({
  instruments,
  channels,
  loading = false,
}: AdminInstrumentPortfolioProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Komposisi Portofolio Filantropi */}
      <div className="card p-5 sm:p-6 shadow-xs border border-brand-200/90 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-brand-100/80 pb-3">
            <div>
              <h2 className="font-serif text-base font-bold text-brand-950 sm:text-lg">
                Portofolio Filantropi Islam
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Sebaran penghimpunan dana per kategori akad dan instrumen syariah.
              </p>
            </div>
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-semibold text-brand-700">
              4 Akad
            </span>
          </div>

          {/* Stacked Distribution Bar */}
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-brand-100/60 p-0.5 shadow-inner">
            {instruments.map((item) => {
              const style = INSTRUMENT_COLORS[item.type] || { bar: "bg-brand-500" };
              if (item.percentage === 0) return null;
              return (
                <div
                  key={item.type}
                  style={{ width: `${Math.max(item.percentage, 3)}%` }}
                  className={`h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 ${style.bar}`}
                  title={`${item.label}: ${item.percentage}%`}
                />
              );
            })}
          </div>

          {/* Items breakdown list */}
          <div className="mt-4 space-y-2.5">
            {instruments.map((item) => {
              const style = INSTRUMENT_COLORS[item.type] || {
                bg: "bg-brand-50",
                text: "text-brand-800",
                bar: "bg-brand-600",
              };

              return (
                <div
                  key={item.type}
                  className="flex items-center justify-between rounded-xl border border-brand-100/80 bg-brand-50/20 p-3 transition hover:border-brand-300 hover:bg-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${style.bar}`} />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-brand-900 truncate">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-brand-400">
                        {item.programCount} program aktif
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-serif text-xs font-bold text-brand-950 sm:text-sm">
                      {formatRupiah(item.totalNominal)}
                    </p>
                    <span className="text-[10px] font-semibold text-brand-600">
                      {item.percentage}% dari total
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-brand-100/80 text-[11px] text-brand-500 flex items-center justify-between">
          <span>Klasifikasi sesuai PSAK 112 & Regulasi BWI</span>
          <span className="font-semibold text-brand-700">100% Akuntabel</span>
        </div>
      </div>

      {/* 2. Kanal Pembayaran Wakif */}
      <div className="card p-5 sm:p-6 shadow-xs border border-brand-200/90 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-brand-100/80 pb-3">
            <div>
              <h2 className="font-serif text-base font-bold text-brand-950 sm:text-lg">
                Preferensi Kanal Pembayaran
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Kanal perbankan dan payment gateway terfavorit wakif.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
              Gerbang Otomatis
            </span>
          </div>

          {channels.length === 0 ? (
            <div className="py-12 text-center text-xs text-brand-400">
              Belum ada transaksi pembayaran lunas yang tercatat.
            </div>
          ) : (
            <div className="mt-4 space-y-2.5">
              {channels.map((channel, idx) => (
                <div
                  key={channel.bank}
                  className="rounded-xl border border-brand-100/80 bg-brand-50/20 p-3 transition hover:border-emerald-300 hover:bg-white"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-100 text-[10px] font-bold text-brand-800">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wide text-brand-900">
                        {channel.bank}
                      </span>
                      <span className="text-[10px] text-brand-500">
                        ({channel.count} transaksi)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xs font-bold text-brand-950">
                        {formatRupiah(channel.totalNominal)}
                      </span>
                      <span className="ml-2 text-[10px] font-semibold text-emerald-700">
                        {channel.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Channel Progress Line */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100/80">
                    <div
                      style={{ width: `${Math.max(channel.percentage, 4)}%` }}
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-brand-100/80 text-[11px] text-brand-500 flex items-center justify-between">
          <span>Terintegrasi Midtrans Snap & Virtual Account</span>
          <span className="text-emerald-700 font-medium">Auto-Settlement Real-time</span>
        </div>
      </div>
    </div>
  );
}
