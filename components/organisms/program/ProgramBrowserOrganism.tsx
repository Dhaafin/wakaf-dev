"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { ProgramCard } from "./molecules/ProgramCard";
import { ProgramGridSkeleton } from "./molecules/ProgramCardSkeleton";
import { EmptyState } from "@/components/empty-state";
import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  PROGRAM_TYPE_DESC,
  PROGRAM_TYPE_ORDER,
  type ProgramCategory,
} from "@/types";

const CATEGORIES = Object.keys(PROGRAM_CATEGORY_LABEL) as ProgramCategory[];

export function ProgramBrowserOrganism() {
  const searchParams = useSearchParams();
  const initialKategori = searchParams.get("kategori") as ProgramCategory | null;

  const { data, loading, error } = useAsync(() => api.listPrograms(), []);
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState<ProgramCategory | "semua">(
    initialKategori && CATEGORIES.includes(initialKategori)
      ? initialKategori
      : "semua",
  );

  const hasil = useMemo(() => {
    let list = data ?? [];
    if (kategori !== "semua") list = list.filter((p) => p.kategori === kategori);
    const term = q.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (p) =>
          p.nama.toLowerCase().includes(term) ||
          p.lokasi.toLowerCase().includes(term) ||
          p.ringkasan.toLowerCase().includes(term),
      );
    }
    return list;
  }, [data, kategori, q]);

  const seksi = useMemo(
    () =>
      PROGRAM_TYPE_ORDER.map((jenis) => ({
        jenis,
        programs: hasil.filter((p) => p.program_type === jenis),
      })).filter((s) => s.programs.length > 0),
    [hasil],
  );

  return (
    <div className="mt-8">
      {/* Filter bar */}
      <div className="card sticky top-20 z-10 flex flex-col gap-3 p-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400">
            🔍
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama program atau kota…"
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setKategori("semua")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              kategori === "semua"
                ? "bg-brand-600 text-white"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100"
            }`}
          >
            Semua kategori
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setKategori(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                kategori === c
                  ? "bg-brand-600 text-white"
                  : "bg-brand-50 text-brand-700 hover:bg-brand-100"
              }`}
            >
              {PROGRAM_CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Hasil */}
      <div className="mt-6">
        {loading ? (
          <ProgramGridSkeleton />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : seksi.length === 0 ? (
          <EmptyState
            title="Tidak ada program yang cocok"
            desc="Coba ubah kata kunci atau pilih kategori lain."
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-brand-500">
              Menampilkan {hasil.length} program dalam {seksi.length} kelompok
            </p>

            <div className="space-y-12">
              {seksi.map(({ jenis, programs }) => (
                <section key={jenis} id={jenis} className="scroll-mt-24">
                  <h2 className="font-serif text-2xl font-bold text-brand-950">
                    {PROGRAM_TYPE_LABEL[jenis]}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-brand-600">
                    {PROGRAM_TYPE_DESC[jenis]}
                  </p>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {programs.map((p) => (
                      <ProgramCard key={p.id} program={p} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
