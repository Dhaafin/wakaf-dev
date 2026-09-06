"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Transaction } from "@/types";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";

const STATUS_STYLE: Record<Transaction["status"], string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  expired: "bg-red-100 text-red-700",
};

export function TransactionsPanel() {
  const { data, loading, error, refetch } = useAsync(
    () => api.listTransactions(),
    [],
  );
  const [filter, setFilter] = useState<"semua" | Transaction["status"]>("semua");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    let list = data ?? [];
    if (filter !== "semua") list = list.filter((t) => t.status === filter);
    const term = q.trim().toLowerCase();
    if (term)
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(term) ||
          t.emailWakif.toLowerCase().includes(term) ||
          t.namaWakif.toLowerCase().includes(term) ||
          t.programNama.toLowerCase().includes(term),
      );
    return list;
  }, [data, filter, q]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["semua", "pending", "paid", "expired"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f
                  ? "bg-brand-600 text-white"
                  : "bg-white text-brand-600 hover:bg-brand-100"
              }`}
            >
              {f === "semua" ? "Semua" : f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari ID / email / program…"
            className="input w-64 max-w-full py-2 text-xs"
          />
          <button onClick={refetch} className="btn-ghost text-xs">
            ↻
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-200 bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-brand-50 text-left text-xs uppercase tracking-wide text-brand-400">
            <tr>
              <th className="px-4 py-3">Transaksi</th>
              <th className="px-4 py-3">Wakif</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3 text-right">Nominal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <div className="skeleton h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-red-600">
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-brand-400">
                  Tidak ada transaksi.
                </td>
              </tr>
            ) : (
              rows.map((t) => (
                <tr key={t.id} className="hover:bg-brand-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-brand-700">
                    {t.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-900">
                      {t.visibilitas === "anonim" ? "(anonim) " : ""}
                      {t.namaWakif}
                    </p>
                    <p className="text-xs text-brand-400">{t.emailWakif}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-700">{t.programNama}</td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-900">
                    {formatRupiah(t.nominal)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${STATUS_STYLE[t.status]} capitalize`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-500">
                    {formatTanggalWaktu(t.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.status === "paid" && t.certificateId ? (
                      <Link
                        href={`/sertifikat/${encodeURIComponent(t.certificateId)}`}
                        className="text-xs font-semibold text-brand-700 hover:underline"
                      >
                        Sertifikat
                      </Link>
                    ) : t.status === "pending" ? (
                      <Link
                        href={`/wakaf/${t.id}`}
                        className="text-xs font-semibold text-brand-700 hover:underline"
                      >
                        Halaman bayar
                      </Link>
                    ) : (
                      <span className="text-xs text-brand-300">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-brand-400">
        {rows.length} baris ditampilkan. Data real-time dari mock-db.
      </p>
    </div>
  );
}
