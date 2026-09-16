"use client";

import Link from "next/link";
import { Modal } from "@/components/molecules/Modal";
import type { Transaction } from "@/types";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";

export interface AdminTransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function AdminTransactionDetailModal({
  transaction,
  onClose,
}: AdminTransactionDetailModalProps) {
  if (!transaction) return null;

  return (
    <Modal
      isOpen={Boolean(transaction)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Rincian Transaksi</span>
          <span className="font-mono text-xs font-semibold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-md">
            {transaction.id}
          </span>
        </div>
      }
      description="Informasi lengkap transaksi donasi, identitas wakif, dan status verifikasi pembayaran."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {transaction.status === "paid" && transaction.certificateId && (
              <Link
                href={`/sertifikat/${encodeURIComponent(transaction.certificateId)}`}
                className="btn-primary py-2 px-3.5 text-xs inline-flex items-center gap-1.5"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Buka Sertifikat
              </Link>
            )}

            {transaction.status === "pending" && (
              <Link
                href={`/wakaf/${encodeURIComponent(transaction.id)}`}
                className="btn-primary py-2 px-3.5 text-xs inline-flex items-center gap-1.5"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Halaman Bayar
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-outline py-2 px-4 text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Nominal & Status Banner */}
        <div className="rounded-2xl border border-brand-200 bg-sand-50/60 p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
              Total Pembayaran
            </span>
            <p className="font-serif text-2xl font-bold text-brand-950 mt-0.5">
              {formatRupiah(transaction.total)}
            </p>
            {transaction.biayaAdmin > 0 && (
              <p className="text-[11px] text-brand-500">
                Nominal: {formatRupiah(transaction.nominal)} + Admin: {formatRupiah(transaction.biayaAdmin)}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500 block mb-1">
              Status
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                transaction.status === "paid"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : transaction.status === "pending"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  transaction.status === "paid"
                    ? "bg-emerald-500"
                    : transaction.status === "pending"
                    ? "bg-amber-500"
                    : "bg-slate-400"
                }`}
              />
              {transaction.status === "paid"
                ? "Lunas / Sah"
                : transaction.status === "pending"
                ? "Menunggu Pembayaran"
                : "Kedaluwarsa"}
            </span>
          </div>
        </div>

        {/* Grid Detail: Data Wakif & Program */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Identitas Wakif */}
          <div className="rounded-xl border border-brand-100 bg-white p-3.5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500 block border-b border-brand-100 pb-1.5">
              Data Wakif / Donatur
            </span>
            <div>
              <span className="text-brand-400">Nama:</span>
              <p className="font-medium text-brand-950">
                {transaction.visibilitas === "anonim" && (
                  <span className="italic text-brand-400 mr-1 font-normal">(Anonim)</span>
                )}
                {transaction.namaWakif}
              </p>
            </div>
            <div>
              <span className="text-brand-400">Email:</span>
              <p className="font-medium text-brand-950 font-mono text-[11px]">
                {transaction.emailWakif}
              </p>
            </div>
            <div>
              <span className="text-brand-400">Nomor Telepon:</span>
              <p className="font-medium text-brand-950 font-mono text-[11px]">
                {transaction.teleponWakif || "—"}
              </p>
            </div>
            <div>
              <span className="text-brand-400">Pahala Diniatkan Atas Nama:</span>
              <p className="font-medium text-brand-950">
                {transaction.atasNama === "sendiri"
                  ? "Diri Sendiri"
                  : `Orang Lain (${transaction.namaAtasNama || "—"})`}
              </p>
            </div>
          </div>

          {/* Program & Virtual Account */}
          <div className="rounded-xl border border-brand-100 bg-white p-3.5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500 block border-b border-brand-100 pb-1.5">
              Detail Program & Bank
            </span>
            <div>
              <span className="text-brand-400">Program Tujuan:</span>
              <p className="font-medium text-brand-950 line-clamp-2">
                {transaction.programNama}
              </p>
              <span className="text-[10px] text-brand-400 uppercase font-semibold">
                {transaction.program_type.replace(/-/g, " ")}
              </span>
            </div>
            <div>
              <span className="text-brand-400">Bank / Channel:</span>
              <p className="font-semibold text-brand-900">
                {transaction.bank}
              </p>
            </div>
            <div>
              <span className="text-brand-400">Nomor Virtual Account:</span>
              <p className="font-mono font-bold text-brand-950 tracking-wider">
                {transaction.vaNumber}
              </p>
            </div>
            <div>
              <span className="text-brand-400">Waktu Dibuat:</span>
              <p className="text-brand-700">
                {formatTanggalWaktu(transaction.createdAt)}
              </p>
            </div>
            {transaction.paidAt && (
              <div>
                <span className="text-brand-400">Waktu Pembayaran Lunas:</span>
                <p className="text-emerald-700 font-semibold">
                  {formatTanggalWaktu(transaction.paidAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Doa Wakif */}
        {transaction.doa && (
          <div className="rounded-xl border border-brand-100 bg-amber-50/40 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Doa & Harapan Wakif
            </span>
            <p className="italic text-brand-800 leading-relaxed text-xs">
              &ldquo;{transaction.doa}&rdquo;
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
