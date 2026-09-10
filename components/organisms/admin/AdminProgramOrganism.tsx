"use client";

import Link from "next/link";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, persen } from "@/lib/format";
import { PROGRAM_TYPE_LABEL } from "@/types";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { EmptyState } from "@/components/atoms/EmptyState";

export function AdminProgramOrganism() {
  const { data, loading, error, refetch } = useAsync(
    () => api.listPrograms({ status: "all" }),
    [],
  );

  const programs = data?.items ?? [];
  const total = data?.pagination?.total ?? programs.length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
            Kelola Program
          </h1>
          <p className="mt-1 text-sm text-brand-600">
            Daftar program penghimpunan wakaf, infaq, dan zakat di Yayasan KBM.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-brand-600">
            {total} program terdaftar
          </span>
        </div>
      </div>

      {/* Konten Daftar Program */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              onClick={() => refetch()}
              className="btn-outline mt-3 px-4 py-1.5 text-xs text-red-700 border-red-300 hover:bg-red-100"
            >
              Coba lagi
            </button>
          </div>
        ) : programs.length === 0 ? (
          <EmptyState
            title="Belum ada program"
            desc="Program wakaf dan donasi yang didaftarkan akan muncul di sini."
          />
        ) : (
          programs.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge bg-brand-100 text-brand-700 font-medium">
                    {PROGRAM_TYPE_LABEL[p.program_type]}
                  </span>
                  <CategoryBadge kategori={p.kategori} />
                  {!p.aktif && (
                    <span className="badge bg-zinc-100 text-zinc-600">
                      Nonaktif
                    </span>
                  )}
                </div>
                <p className="truncate font-semibold text-brand-950 text-base">
                  {p.nama}
                </p>
                <p className="text-xs text-brand-500">
                  {formatRupiah(p.terkumpul)} / {formatRupiah(p.target)} ·{" "}
                  <span className="font-medium text-brand-700">
                    {persen(p.terkumpul, p.target)}%
                  </span>{" "}
                  · {p.jumlahWakif} wakif · {p.lokasi}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/program/${p.slug}`}
                  target="_blank"
                  className="btn-outline px-3 py-2 text-xs"
                >
                  Lihat di publik ↗
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
