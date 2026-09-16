"use client";

import { useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import {
  formatRupiah,
  formatRupiahCompact,
  formatTanggal,
  persen,
} from "@/lib/format";
import { CountUp } from "@/components/atoms/CountUp";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { RecentDonations } from "@/components/recent-donations";

export default function TransparansiPage() {
  // 1. Fetch Global Stats Resmi dari Backend DB
  const { data: stats, loading: statsLoading } = useAsync(
    () => api.getStats(),
    [],
  );

  // 2. Fetch seluruh program aktif (sampai 100 item) untuk rekap program
  const { data: programsData, loading: programsLoading } = useAsync(
    () => api.listPrograms({ limit: 100, status: "active" }),
    [],
  );

  // 3. Fetch feed penyaluran dana riil dari API penyaluran
  const { data: disbursementsData, loading: disbLoading } = useAsync(
    () => api.listDisbursements({ limit: 50 }),
    [],
  );

  const programs = programsData?.items ?? [];
  const disbursements = disbursementsData?.items ?? [];

  const totalTerkumpul = stats?.totalTerkumpul ?? 0;
  const totalDisalurkan = stats?.totalDisalurkan ?? 0;
  const rasioPenyaluran = persen(totalDisalurkan, totalTerkumpul || 1);

  const loading = statsLoading || programsLoading || disbLoading;

  return (
    <div className="container-app py-10 space-y-12">
      {/* HEADER EDITORIAL */}
      <header className="max-w-3xl space-y-3">
        <span className="inline-block rounded-full bg-brand-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-800">
          Akuntabilitas & Transparansi Public
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-950 sm:text-4xl lg:text-5xl">
          Laporan Amanah & Penyaluran Dana
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-brand-700">
          Seluruh penghimpunan dana wakaf, infaq, dan zakat dilaporkan secara terbuka
          dan terverifikasi. Kami menjamin setiap rupiah disalurkan sesuai akad dan syariat Islam.
        </p>
      </header>

      {loading ? (
        <div className="space-y-6">
          <div className="skeleton h-32 w-full rounded-3xl" />
          <div className="skeleton h-64 w-full rounded-3xl" />
        </div>
      ) : (
        <>
          {/* KPI STATS CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-brand-200/90 bg-gradient-to-br from-white to-brand-50/50 p-6 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                Total Dana Terhimpun
              </p>
              <p className="mt-2 font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
                <CountUp value={totalTerkumpul} format={formatRupiahCompact} />
              </p>
              <p className="mt-1 text-[11px] text-brand-600">
                {formatRupiah(totalTerkumpul)}
              </p>
            </div>

            <div className="rounded-3xl border border-brand-200/90 bg-gradient-to-br from-white to-brand-50/50 p-6 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                Total Realisasi Penyaluran
              </p>
              <p className="mt-2 font-serif text-2xl font-bold text-emerald-700 sm:text-3xl">
                <CountUp value={totalDisalurkan} format={formatRupiahCompact} />
              </p>
              <p className="mt-1 text-[11px] text-brand-600">
                {formatRupiah(totalDisalurkan)}
              </p>
            </div>

            <div className="rounded-3xl border border-brand-200/90 bg-gradient-to-br from-white to-brand-50/50 p-6 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                Rasio Efektivitas Penyaluran
              </p>
              <p className="mt-2 font-serif text-2xl font-bold text-brand-900 sm:text-3xl">
                {rasioPenyaluran}%
              </p>
              <div className="mt-2.5 h-1.5 w-full rounded-full bg-brand-100 overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, rasioPenyaluran)}%` }}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-brand-200/90 bg-gradient-to-br from-white to-brand-50/50 p-6 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                Partisipasi Wakif & Donatur
              </p>
              <p className="mt-2 font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
                <CountUp value={stats?.totalWakif ?? 0} />
              </p>
              <p className="mt-1 text-[11px] text-brand-600">
                {stats?.totalTransaksiPaid ?? 0} transaksi lunas
              </p>
            </div>
          </div>

          {/* TESTIMONI & RIWAYAT DONASI PUBLIK */}
          <RecentDonations limit={6} />

          {/* REKAP DANA PER PROGRAM */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-brand-200/80 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-950">
                  Capaian & Rekap Per Program
                </h2>
                <p className="text-xs text-brand-600">
                  Perbandingan penerimaan dana dan pengalokasian manfaat per program
                </p>
              </div>
              <span className="text-xs font-semibold text-brand-500">
                Menampilkan {programs.length} Program
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => {
                const disbTotal = (p.disbursements || []).reduce(
                  (acc, d) => acc + d.nominal,
                  0,
                );
                const pct = p.target > 0 ? Math.min(100, Math.round((p.terkumpul / p.target) * 100)) : 0;

                return (
                  <div
                    key={p.id}
                    className="group rounded-2xl border border-brand-200/80 bg-white p-5 shadow-xs transition hover:border-brand-300 hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <CategoryBadge kategori={p.kategori} />
                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                          {pct}% Tercapai
                        </span>
                      </div>
                      <Link
                        href={`/program/${p.slug}`}
                        className="font-semibold text-brand-950 group-hover:text-brand-700 line-clamp-2 transition"
                      >
                        {p.nama}
                      </Link>
                      <p className="text-xs text-brand-600 line-clamp-2">
                        {p.ringkasan}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-brand-100 space-y-2 text-xs">
                      <div className="flex justify-between text-brand-600">
                        <span>Terkumpul:</span>
                        <span className="font-semibold text-brand-950">{formatRupiah(p.terkumpul)}</span>
                      </div>
                      <div className="flex justify-between text-brand-600">
                        <span>Disalurkan:</span>
                        <span className="font-semibold text-emerald-700">{formatRupiah(disbTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LINIMASA PENYALURAN DANA */}
          <section className="space-y-6 pt-4">
            <div className="border-b border-brand-200/80 pb-4">
              <h2 className="font-serif text-2xl font-bold text-brand-950">
                Bukti & Linimasa Penyaluran
              </h2>
              <p className="text-xs text-brand-600">
                Catatan realisasi program bersertifikat dokumentasi & kuitansi
              </p>
            </div>

            {disbursements.length === 0 ? (
              <EmptyState
                title="Belum ada penyaluran tercatat"
                desc="Laporan penyaluran yang diinput oleh pengelola akan tampil di sini."
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {disbursements.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-3xl border border-brand-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-brand-500">
                          {formatTanggal(d.tanggal)}
                        </span>
                        <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold text-emerald-800">
                          {formatRupiah(d.nominal)}
                        </span>
                      </div>
                      <h3 className="font-bold text-brand-950 text-base">
                        {d.judul}
                      </h3>
                      {d.program && (
                        <Link
                          href={`/program/${d.program.slug}`}
                          className="inline-block text-xs font-semibold text-brand-600 hover:text-brand-800 underline"
                        >
                          {d.program.nama}
                        </Link>
                      )}
                      <p className="text-xs sm:text-sm text-brand-700 leading-relaxed pt-1">
                        {d.deskripsi}
                      </p>
                    </div>

                    {d.buktiImageUrl && (
                      <div className="pt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.buktiImageUrl}
                          alt={`Bukti: ${d.judul}`}
                          className="h-48 w-full rounded-2xl object-cover border border-brand-100"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
