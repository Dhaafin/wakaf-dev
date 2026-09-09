"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { PublicDonation } from "@/types";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, formatRelativeTime } from "@/lib/format";
import { EmptyState } from "@/components/atoms/EmptyState";
import { PROGRAM_TYPE_LABEL, PROGRAM_TYPE_TERMS } from "@/types";

// "Wall of donors" untuk halaman transparansi: menampilkan wakif yang baru saja
// menyelesaikan pembayaran. Data dari /api/donations (proyeksi publik: tanpa
// email/telepon; nama jadi "Hamba Allah" bila wakif memilih anonim).
export function RecentDonations({ limit = 10 }: { limit?: number }) {
  const { data, loading, error, refetch } = useAsync(
    () => api.listRecentDonations(limit),
    [limit],
  );

  // Poll ringan supaya wakaf mock yang baru sukses ikut muncul tanpa reload.
  useEffect(() => {
    const id = setInterval(refetch, 20000);
    return () => clearInterval(id);
  }, [refetch]);

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-950">
            Transaksi terbaru
          </h2>
          <p className="mt-1 text-sm text-brand-600">
            Setiap wakaf, infaq, dan zakat yang lunas langsung tercatat di sini.
            Pemberi yang memilih anonim tampil sebagai &ldquo;Hamba
            Allah&rdquo;.
          </p>
        </div>
        <button
          onClick={refetch}
          className="self-start text-xs font-semibold text-brand-700 hover:text-brand-900 sm:shrink-0 sm:self-auto"
        >
          ↻ Perbarui
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <ul className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="skeleton h-[68px] w-full rounded-2xl" />
            ))}
          </ul>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !data || data.length === 0 ? (
          <EmptyState
            title="Belum ada transaksi tercatat"
            desc="Pemberi yang menyelesaikan pembayaran akan muncul di sini."
          />
        ) : (
          <ul className="space-y-2">
            {data.map((d) => (
              <DonationRow key={d.id} d={d} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function DonationRow({ d }: { d: PublicDonation }) {
  const inisial = d.anonim
    ? "🤲"
    : d.nama
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

  return (
    <li className="card flex items-start gap-3 p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          d.anonim
            ? "bg-brand-50 text-base"
            : "bg-brand-100 text-brand-700"
        }`}
        aria-hidden
      >
        {inisial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-semibold text-brand-950">
            {d.nama}
            <span className="ml-2 badge bg-brand-50 align-middle text-brand-600">
              {PROGRAM_TYPE_LABEL[d.program_type]}
            </span>
          </p>
          <span className="text-xs text-brand-400">
            {formatRelativeTime(d.paidAt)}
          </span>
        </div>
        <p className="text-sm text-brand-600">
          {PROGRAM_TYPE_TERMS[d.program_type].kataKerja}{" "}
          <span className="font-semibold text-brand-800">
            {formatRupiah(d.nominal)}
          </span>{" "}
          untuk{" "}
          <Link
            href={`/program/${d.programId}`}
            className="font-medium text-brand-700 hover:text-brand-900"
          >
            {d.programNama}
          </Link>
        </p>
        {d.doa && (
          <p className="mt-1 border-l-2 border-brand-100 pl-2 text-xs italic text-brand-500">
            &ldquo;{d.doa}&rdquo;
          </p>
        )}
      </div>
    </li>
  );
}
