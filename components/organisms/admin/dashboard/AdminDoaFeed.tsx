"use client";

import Link from "next/link";
import { formatRupiah, formatTanggal } from "@/lib/format";
import type { RecentDoaItem } from "@/types";
import { Skeleton } from "@/components/atoms/Skeleton";

export interface AdminDoaFeedProps {
  items: RecentDoaItem[];
  loading?: boolean;
}

export function AdminDoaFeed({ items, loading = false }: AdminDoaFeedProps) {
  if (loading) {
    return (
      <div className="card p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="card p-5 sm:p-6 shadow-xs border border-brand-200/90 bg-white space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-brand-100/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
            </span>
            <h2 className="font-serif text-base font-bold text-brand-950 sm:text-lg">
              Untaian Doa & Hajat Para Wakif
            </h2>
          </div>
          <p className="text-xs text-brand-500 mt-0.5">
            Doa tulus yang dititipkan donatur bersamaan dengan penunaian akad wakaf dan infaq.
          </p>
        </div>

        <Link
          href="/admin/transaksi"
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors"
        >
          Audit Transaksi Masuk →
        </Link>
      </div>

      {/* Grid Doa Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-brand-100/90 bg-sand-50/40 p-4 transition hover:border-brand-300 hover:bg-white hover:shadow-xs"
          >
            <div>
              {/* Header card: Nama & Nominal */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-brand-100/60">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-200/60 text-xs font-bold text-brand-800 shrink-0">
                    {item.namaWakif.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-brand-950 truncate">
                      {item.namaWakif}
                    </p>
                    <p className="text-[10px] text-brand-400 truncate">
                      {item.programNama}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-serif text-xs font-bold text-emerald-800 block">
                    {formatRupiah(item.nominal)}
                  </span>
                  <span className="text-[9px] text-brand-400">
                    {formatTanggal(item.createdAt)}
                  </span>
                </div>
              </div>

              {/* Quote Doa */}
              <p className="font-serif text-xs italic text-brand-800 leading-relaxed line-clamp-3">
                “{item.doa}”
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-brand-400 pt-2 border-t border-brand-100/40">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Telah Diijabkabulkan
              </span>
              <span>ID: #{item.id.slice(0, 8)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
