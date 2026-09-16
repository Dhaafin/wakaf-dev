"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import type { CampaignRadarItem } from "@/types";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Skeleton } from "@/components/atoms/Skeleton";

export interface AdminCampaignRadarProps {
  topCampaigns: CampaignRadarItem[];
  needHelpCampaigns: CampaignRadarItem[];
  loading?: boolean;
}

export function AdminCampaignRadar({
  topCampaigns,
  needHelpCampaigns,
  loading = false,
}: AdminCampaignRadarProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Program Performa Tertinggi / Mendekati Target */}
      <div className="card p-5 sm:p-6 shadow-xs border border-brand-200/90 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-brand-100/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <h2 className="font-serif text-base font-bold text-brand-950 sm:text-lg">
                  Radar Capaian Program Unggulan
                </h2>
              </div>
              <p className="text-xs text-brand-500 mt-0.5">
                Program wakaf dengan persentase realisasi tertinggi & antusiasme wakif tinggi.
              </p>
            </div>
            <Link
              href="/admin/program"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors"
            >
              Lihat Semua →
            </Link>
          </div>

          {topCampaigns.length === 0 ? (
            <div className="py-12 text-center text-xs text-brand-400">
              Belum ada program wakaf aktif.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {topCampaigns.map((camp, idx) => (
                <div
                  key={camp.id}
                  className="rounded-xl border border-brand-100/80 bg-brand-50/20 p-3.5 transition hover:border-emerald-300 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-flex items-center justify-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          #{idx + 1} Top
                        </span>
                        <CategoryBadge kategori={camp.kategori} className="text-[10px] py-0 px-2" />
                      </div>
                      <Link
                        href={`/program/${camp.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-brand-950 hover:text-brand-700 transition line-clamp-1 block"
                        title={camp.nama}
                      >
                        {camp.nama}
                      </Link>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-xs font-bold text-emerald-900 sm:text-sm">
                        {camp.percentage}%
                      </span>
                      <span className="block text-[10px] text-brand-500 font-medium">
                        {camp.jumlahWakif} wakif
                      </span>
                    </div>
                  </div>

                  <ProgressBar terkumpul={camp.terkumpul} target={camp.target} size="sm" showLabel={false} />

                  <div className="mt-2 flex items-center justify-between text-[10px] text-brand-500">
                    <span>
                      Terkumpul: <b className="text-brand-900 font-serif">{formatRupiah(camp.terkumpul)}</b>
                    </span>
                    <span>
                      Target: <b className="text-brand-700 font-serif">{formatRupiah(camp.target)}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-brand-100/80 text-[11px] text-brand-500 flex items-center justify-between">
          <span>Mempertahankan momentum kepercayaan donatur</span>
          <span className="text-emerald-700 font-medium">Prioritas Realisasi</span>
        </div>
      </div>

      {/* 2. Program Memerlukan Akselerasi Pendanaan */}
      <div className="card p-5 sm:p-6 shadow-xs border border-brand-200/90 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-brand-100/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                <h2 className="font-serif text-base font-bold text-brand-950 sm:text-lg">
                  Program Perlu Akselerasi
                </h2>
              </div>
              <p className="text-xs text-brand-500 mt-0.5">
                Program berstatus mendesak yang memerlukan publikasi & dorongan wakif.
              </p>
            </div>
            <Link
              href="/admin/pengaturan"
              className="text-xs font-semibold text-accent-700 hover:text-accent-900 transition-colors"
            >
              Pasang Banner →
            </Link>
          </div>

          {needHelpCampaigns.length === 0 ? (
            <div className="py-12 text-center text-xs text-brand-400">
              Seluruh program saat ini berada di atas ambang batas target.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {needHelpCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="rounded-xl border border-brand-100/80 bg-brand-50/20 p-3.5 transition hover:border-amber-300 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-flex items-center justify-center rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                          Akselerasi
                        </span>
                        <CategoryBadge kategori={camp.kategori} className="text-[10px] py-0 px-2" />
                      </div>
                      <Link
                        href={`/program/${camp.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-brand-950 hover:text-brand-700 transition line-clamp-1 block"
                        title={camp.nama}
                      >
                        {camp.nama}
                      </Link>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-xs font-bold text-amber-900 sm:text-sm">
                        {camp.percentage}%
                      </span>
                      <span className="block text-[10px] text-brand-500 font-medium">
                        {camp.jumlahWakif} wakif
                      </span>
                    </div>
                  </div>

                  <ProgressBar terkumpul={camp.terkumpul} target={camp.target} size="sm" showLabel={false} />

                  <div className="mt-2 flex items-center justify-between text-[10px] text-brand-500">
                    <span>
                      Terkumpul: <b className="text-brand-900 font-serif">{formatRupiah(camp.terkumpul)}</b>
                    </span>
                    <span>
                      Target: <b className="text-brand-700 font-serif">{formatRupiah(camp.target)}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-brand-100/80 text-[11px] text-brand-500 flex items-center justify-between">
          <span>Rekomendasi: Sorot program via Top Announcement</span>
          <span className="text-amber-700 font-medium">Butuh Promosi</span>
        </div>
      </div>
    </div>
  );
}
