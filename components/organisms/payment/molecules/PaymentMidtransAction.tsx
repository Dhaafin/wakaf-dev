"use client";

import Link from "next/link";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { Spinner } from "@/components/atoms/Spinner";
import type { Transaction } from "@/types";

interface PaymentMidtransActionProps {
  tx: Transaction;
  onOpenMidtrans: () => void;
  onManualCheck: () => void;
  checking: boolean;
}

export function PaymentMidtransAction({
  tx,
  onOpenMidtrans,
  onManualCheck,
  checking,
}: PaymentMidtransActionProps) {
  return (
    <div className="card overflow-hidden border border-brand-200/90 bg-white p-6 shadow-sm">
      {/* Total Tagihan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-brand-100 pb-5">
        <div>
          <span className="text-xs font-medium text-brand-500 uppercase tracking-wider">
            Total Tagihan
          </span>
          <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-brand-950">
            {formatRupiah(tx.total)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Bebas Biaya Admin
          </span>
        </div>
      </div>

      {/* Rincian Transaksi */}
      <dl className="mt-4 space-y-2 text-xs sm:text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-brand-500">Program</dt>
          <dd className="font-medium text-brand-900 text-right line-clamp-1 max-w-[240px] sm:max-w-xs">
            <Link
              href={`/program/${tx.programId}`}
              className="hover:text-brand-700 underline decoration-brand-300 underline-offset-2"
            >
              {tx.programNama}
            </Link>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-brand-500">Atas nama wakif</dt>
          <dd className="font-medium text-brand-900">
            {tx.atasNama === "orang-lain" ? tx.namaAtasNama : tx.namaWakif}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-brand-500">Waktu pembuatan</dt>
          <dd className="font-medium text-brand-800">
            {formatTanggalWaktu(tx.createdAt)}
          </dd>
        </div>
      </dl>

      {/* Tombol Utama Buka Midtrans */}
      <div className="mt-6 pt-5 border-t border-brand-100">
        <button
          type="button"
          onClick={onOpenMidtrans}
          className="btn-primary w-full py-3.5 text-sm sm:text-base font-semibold shadow-md flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer"
        >
          <svg
            className="h-5 w-5 text-white shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z"
            />
          </svg>
          <span>Buka Pembayaran Midtrans (QRIS / VA)</span>
        </button>

        {/* Dukungan Metode */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-brand-500">
          <span className="font-medium">Mendukung:</span>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">QRIS</span>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">BCA VA</span>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">Mandiri</span>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">BNI</span>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">BRI</span>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">Permata</span>
          <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">GoPay/ShopeePay</span>
        </div>
      </div>

      {/* Bar Sinkronisasi & Cek Status */}
      <div className="mt-5 flex items-center justify-between rounded-xl bg-brand-50/80 px-4 py-2.5 text-xs text-brand-600">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Status mengecek otomatis...</span>
        </div>
        <button
          type="button"
          onClick={onManualCheck}
          disabled={checking}
          className="font-semibold text-brand-800 hover:text-brand-950 inline-flex items-center gap-1 transition disabled:opacity-50"
        >
          {checking && <Spinner className="h-3 w-3 text-brand-700" />}
          {checking ? "Memeriksa..." : "Periksa Sekarang"}
        </button>
      </div>
    </div>
  );
}
