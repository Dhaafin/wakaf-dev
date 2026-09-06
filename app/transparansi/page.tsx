"use client";

import { useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, formatTanggal, persen } from "@/lib/format";
import { CountUp } from "@/components/count-up";
import { CategoryBadge } from "@/components/category-badge";
import { EmptyState } from "@/components/empty-state";

// Halaman transparansi. SELURUH data di sini dibaca dari mock-db yang sama
// dengan yang diisi lewat Admin Panel (POST /api/programs/:id/disbursements).
// Jadi begitu admin menambah laporan penyaluran, halaman ini ikut berubah.
export default function TransparansiPage() {
  const { data: programs, loading, error } = useAsync(
    () => api.listPrograms(),
    [],
  );

  const rows = useMemo(() => {
    if (!programs) return [];
    return programs
      .flatMap((p) =>
        p.disbursements.map((d) => ({
          ...d,
          programNama: p.nama,
          kategori: p.kategori,
          programSlug: p.slug,
        })),
      )
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [programs]);

  const totalTerkumpul = (programs ?? []).reduce((s, p) => s + p.terkumpul, 0);
  const totalDisalurkan = rows.reduce((s, d) => s + d.nominal, 0);

  return (
    <div className="container-app py-10">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-brand-950 sm:text-4xl">
          Laporan Transparansi
        </h1>
        <p className="mt-2 text-brand-600">
          Setiap rupiah yang tersalur dilaporkan lengkap dengan bukti. Data pada
          halaman ini terhubung langsung dengan pencatatan internal yayasan.
        </p>
      </header>

      {loading ? (
        <div className="mt-8 space-y-4">
          <div className="skeleton h-24 w-full rounded-2xl" />
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <p className="mt-8 text-sm text-red-600">{error}</p>
      ) : (
        <>
          {/* Ringkasan */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-xs text-brand-500">Total dana terkumpul</p>
              <p className="mt-1 font-serif text-2xl font-bold text-brand-800">
                <CountUp value={totalTerkumpul} format={formatRupiah} />
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-brand-500">Total dana tersalurkan</p>
              <p className="mt-1 font-serif text-2xl font-bold text-brand-800">
                <CountUp value={totalDisalurkan} format={formatRupiah} />
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs text-brand-500">Rasio penyaluran</p>
              <p className="mt-1 font-serif text-2xl font-bold text-brand-800">
                {persen(totalDisalurkan, totalTerkumpul || 1)}%
              </p>
            </div>
          </div>

          {/* Rekap per program */}
          <h2 className="mt-12 font-serif text-xl font-bold text-brand-950">
            Rekap per program
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-brand-400">
                  <th className="px-4 py-2">Program</th>
                  <th className="px-4 py-2 text-right">Terkumpul</th>
                  <th className="px-4 py-2 text-right">Tersalurkan</th>
                  <th className="px-4 py-2 text-right">Sisa dikelola</th>
                </tr>
              </thead>
              <tbody>
                {(programs ?? []).map((p) => {
                  const disb = p.disbursements.reduce(
                    (s, d) => s + d.nominal,
                    0,
                  );
                  return (
                    <tr key={p.id} className="bg-white">
                      <td className="rounded-l-xl px-4 py-3">
                        <Link
                          href={`/program/${p.slug}`}
                          className="font-medium text-brand-900 hover:text-brand-700"
                        >
                          {p.nama}
                        </Link>
                        <div className="mt-1">
                          <CategoryBadge kategori={p.kategori} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-800">
                        {formatRupiah(p.terkumpul)}
                      </td>
                      <td className="px-4 py-3 text-right text-brand-700">
                        {formatRupiah(disb)}
                      </td>
                      <td className="rounded-r-xl px-4 py-3 text-right text-brand-700">
                        {formatRupiah(Math.max(0, p.terkumpul - disb))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Linimasa penyaluran */}
          <h2 className="mt-12 font-serif text-xl font-bold text-brand-950">
            Linimasa penyaluran
          </h2>
          {rows.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="Belum ada penyaluran tercatat"
                desc="Laporan penyaluran yang diinput admin akan tampil di sini."
              />
            </div>
          ) : (
            <ol className="mt-4 space-y-4 border-l-2 border-brand-100 pl-5">
              {rows.map((d) => (
                <li key={d.id} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-500" />
                  <div className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-brand-500">
                          {formatTanggal(d.tanggal)}
                        </p>
                        <p className="font-semibold text-brand-950">
                          {d.judul}
                        </p>
                        <Link
                          href={`/program/${d.programSlug}`}
                          className="text-xs text-brand-600 hover:text-brand-800"
                        >
                          {d.programNama} →
                        </Link>
                      </div>
                      <span className="badge bg-brand-100 text-brand-800">
                        {formatRupiah(d.nominal)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-brand-600">{d.deskripsi}</p>
                    {d.buktiImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.buktiImageUrl}
                        alt={`Bukti: ${d.judul}`}
                        className="mt-3 max-h-64 w-full rounded-xl object-cover"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}

          <p className="mt-10 rounded-xl bg-brand-50 p-4 text-xs text-brand-500">
            Ingin membuktikan data ini terhubung? Buka{" "}
            <Link href="/admin" className="font-semibold text-brand-700 underline">
              Panel Admin
            </Link>
            , tambahkan laporan penyaluran pada salah satu program, lalu segarkan
            halaman ini — entri baru akan langsung muncul.
          </p>
        </>
      )}
    </div>
  );
}
