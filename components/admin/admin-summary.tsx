"use client";

import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah } from "@/lib/format";

export function AdminSummary() {
  const { data, loading, refetch } = useAsync(
    () => Promise.all([api.getStats(), api.listTransactions()]),
    [],
  );
  const stats = data?.[0];
  const txs = data?.[1] ?? [];

  const pending = txs.filter((t) => t.status === "pending").length;
  const expired = txs.filter((t) => t.status === "expired").length;

  const cards = [
    { label: "Dana terkumpul", value: stats ? formatRupiah(stats.totalTerkumpul) : "—" },
    { label: "Dana tersalurkan", value: stats ? formatRupiah(stats.totalDisalurkan) : "—" },
    { label: "Pemberi unik", value: stats ? stats.totalWakif.toString() : "—" },
    { label: "Transaksi lunas", value: stats ? stats.totalTransaksiPaid.toString() : "—" },
    { label: "Menunggu pembayaran", value: pending.toString() },
    { label: "Kedaluwarsa", value: expired.toString() },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={refetch} className="btn-ghost text-xs">
          ↻ Muat ulang
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-brand-200 bg-white p-5"
          >
            {loading ? (
              <div className="skeleton h-7 w-24" />
            ) : (
              <p className="font-serif text-xl font-bold text-brand-800">
                {c.value}
              </p>
            )}
            <p className="mt-1 text-xs text-brand-500">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
