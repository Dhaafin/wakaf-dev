"use client";

import { useState } from "react";
import Link from "next/link";
import type { Transaction, TransactionStatus } from "@/types";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { Pagination } from "@/components/molecules/Pagination";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";

const STATUS_BADGE: Record<
  TransactionStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  paid: {
    label: "Lunas / Sah",
    bg: "bg-emerald-50 border-emerald-200/80",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Menunggu",
    bg: "bg-amber-50 border-amber-200/80",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  expired: {
    label: "Kedaluwarsa",
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
};

export interface AdminTransactionTableProps {
  loading: boolean;
  error: string | null;
  items: Transaction[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  startItem: number;
  endItem: number;
  hasActiveFilters: boolean;
  onSelectTransaction: (item: Transaction) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onResetFilters: () => void;
  onReload: () => void;
}

export function AdminTransactionTable({
  loading,
  error,
  items,
  total,
  totalPages,
  page,
  limit,
  startItem,
  endItem,
  hasActiveFilters,
  onSelectTransaction,
  onPageChange,
  onLimitChange,
  onResetFilters,
  onReload,
}: AdminTransactionTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div className="rounded-2xl border border-brand-200/90 bg-white shadow-xs overflow-hidden">
      {/* 1. STATE: ERROR */}
      {error && !loading && (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-200">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-950">
            Gagal Memuat Data Transaksi
          </p>
          <p className="mt-1 text-xs text-brand-500">{error}</p>
          <button
            type="button"
            onClick={onReload}
            className="btn-outline mt-4 py-2 px-4 text-xs cursor-pointer"
          >
            Coba Muat Ulang
          </button>
        </div>
      )}

      {/* 2. STATE: LOADING SKELETON */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Spinner className="h-8 w-8 text-brand-600" />
          <p className="mt-3 text-xs font-semibold text-brand-700">
            Memuat daftar transaksi donasi...
          </p>
        </div>
      )}

      {/* 3. STATE: EMPTY RESULT */}
      {!loading && !error && items.length === 0 && (
        <div className="p-8">
          <EmptyState
            title={
              hasActiveFilters
                ? "Tidak ada transaksi yang cocok"
                : "Belum ada riwayat transaksi"
            }
            desc={
              hasActiveFilters
                ? "Kriteria filter atau kata kunci yang Anda cari tidak menghasilkan transaksi. Coba gunakan istilah pencarian lain."
                : "Seluruh donasi dan wakaf yang masuk akan tercatat secara akuntabel di halaman ini."
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="btn-primary text-xs"
                >
                  Reset Filter
                </button>
              ) : undefined
            }
          />
        </div>
      )}

      {/* 4. STATE: DATA TABEL */}
      {!loading && !error && items.length > 0 && (
        <>
          {/* DESKTOP TABLE (Hidden on small screens) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-800">
              <thead className="bg-sand-50/80 border-b border-brand-200/80 text-[11px] font-bold uppercase tracking-wider text-brand-500">
                <tr>
                  <th className="px-5 py-3.5">ID Transaksi & Bank</th>
                  <th className="px-5 py-3.5">Pemberi / Wakif</th>
                  <th className="px-5 py-3.5">Program Tujuan</th>
                  <th className="px-5 py-3.5 text-right">Nominal</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Waktu Transaksi</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/70">
                {items.map((tx) => {
                  const badge = STATUS_BADGE[tx.status];
                  return (
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-sand-50/60"
                    >
                      {/* ID Transaksi */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-950">
                          <span>{tx.id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tx.id)}
                            title="Salin ID Transaksi"
                            className="text-brand-400 hover:text-brand-700 p-0.5 rounded cursor-pointer"
                          >
                            {copiedId === tx.id ? (
                              <span className="text-[10px] text-emerald-600 font-sans">✓</span>
                            ) : (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.25 11.25H6.375A2.25 2.25 0 014.125 16.5V7.5" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-brand-500">
                          <span className="font-semibold uppercase tracking-wider text-brand-600 bg-brand-100/60 px-1.5 py-0.5 rounded text-[10px]">
                            {tx.bank}
                          </span>
                          <span className="font-mono">{tx.vaNumber}</span>
                        </div>
                      </td>

                      {/* Pemberi / Wakif */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="font-medium text-brand-950">
                          {tx.visibilitas === "anonim" && (
                            <span className="italic text-brand-400 mr-1 text-[11px] font-normal">
                              (Anonim)
                            </span>
                          )}
                          {tx.namaWakif}
                        </div>
                        <p className="text-[11px] text-brand-400 truncate max-w-[180px]">
                          {tx.emailWakif}
                        </p>
                        {tx.atasNama === "orang-lain" && tx.namaAtasNama && (
                          <p className="mt-0.5 text-[10px] text-amber-700">
                            a.n. <span className="font-semibold">{tx.namaAtasNama}</span>
                          </p>
                        )}
                        {tx.doa && (
                          <p className="mt-1 text-[11px] italic text-brand-600/90 line-clamp-1 max-w-[200px]" title={tx.doa}>
                            &ldquo;{tx.doa}&rdquo;
                          </p>
                        )}
                      </td>

                      {/* Program Tujuan */}
                      <td className="px-5 py-3.5 align-top">
                        <p className="font-medium text-brand-950 line-clamp-2 max-w-[220px]">
                          {tx.programNama}
                        </p>
                        <span className="mt-0.5 inline-block text-[10px] uppercase font-semibold tracking-wider text-brand-400">
                          {tx.program_type.replace(/-/g, " ")}
                        </span>
                      </td>

                      {/* Nominal */}
                      <td className="px-5 py-3.5 align-top text-right">
                        <span className="font-serif text-sm font-bold text-brand-950 block">
                          {formatRupiah(tx.nominal)}
                        </span>
                        {tx.biayaAdmin > 0 && (
                          <span className="text-[10px] text-brand-400">
                            Admin: +{formatRupiah(tx.biayaAdmin)}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${badge.bg} ${badge.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Waktu Transaksi */}
                      <td className="px-5 py-3.5 align-top text-[11px] text-brand-600">
                        <div>{formatTanggalWaktu(tx.createdAt)}</div>
                        {tx.paidAt && (
                          <div className="mt-0.5 text-[10px] text-emerald-700 font-medium">
                            Lunas: {formatTanggalWaktu(tx.paidAt)}
                          </div>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectTransaction(tx)}
                            className="rounded-lg border border-brand-200 bg-sand-50/50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 hover:text-brand-900 transition-colors cursor-pointer"
                          >
                            Detail
                          </button>

                          {tx.status === "paid" && tx.certificateId && (
                            <Link
                              href={`/sertifikat/${encodeURIComponent(tx.certificateId)}`}
                              className="rounded-lg border border-emerald-300 bg-emerald-50/60 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                              title="Lihat Sertifikat Wakaf Digital"
                            >
                              Sertifikat
                            </Link>
                          )}

                          {tx.status === "pending" && (
                            <Link
                              href={`/wakaf/${encodeURIComponent(tx.id)}`}
                              className="rounded-lg border border-amber-300 bg-amber-50/60 px-2.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                              title="Halaman Pembayaran Wakaf"
                            >
                              Bayar
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD LIST (Hidden on desktop) */}
          <div className="lg:hidden divide-y divide-brand-100">
            {items.map((tx) => {
              const badge = STATUS_BADGE[tx.status];
              return (
                <div key={tx.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-brand-950">
                        {tx.id}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold uppercase tracking-wider text-brand-600 bg-brand-100/60 px-1.5 py-0.5 rounded text-[10px]">
                          {tx.bank}
                        </span>
                        <span className="text-[11px] text-brand-400 font-mono">
                          {tx.vaNumber}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${badge.bg} ${badge.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  <div>
                    <p className="font-serif text-base font-bold text-brand-950">
                      {formatRupiah(tx.nominal)}
                    </p>
                    <p className="text-xs font-medium text-brand-700 mt-0.5">
                      {tx.programNama}
                    </p>
                  </div>

                  <div className="rounded-xl bg-sand-50/80 p-2.5 text-xs space-y-1">
                    <p className="text-brand-900 font-medium">
                      {tx.visibilitas === "anonim" ? "(Anonim) " : ""}
                      {tx.namaWakif}
                    </p>
                    <p className="text-brand-500 text-[11px]">{tx.emailWakif}</p>
                    {tx.doa && (
                      <p className="italic text-brand-600 text-[11px] pt-1 border-t border-brand-100">
                        &ldquo;{tx.doa}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-brand-500">
                    <span>{formatTanggalWaktu(tx.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectTransaction(tx)}
                        className="font-semibold text-brand-700 underline"
                      >
                        Detail
                      </button>
                      {tx.status === "paid" && tx.certificateId && (
                        <Link
                          href={`/sertifikat/${encodeURIComponent(tx.certificateId)}`}
                          className="font-semibold text-emerald-700 underline"
                        >
                          Sertifikat
                        </Link>
                      )}
                      {tx.status === "pending" && (
                        <Link
                          href={`/wakaf/${encodeURIComponent(tx.id)}`}
                          className="font-semibold text-amber-700 underline"
                        >
                          Bayar
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5. ELEVATED PAGINATION FOOTER */}
          <div className="border-t border-brand-200/80 bg-sand-50/40 p-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              startItem={startItem}
              endItem={endItem}
              limit={limit}
              itemName="transaksi"
              onPageChange={onPageChange}
              onLimitChange={onLimitChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
