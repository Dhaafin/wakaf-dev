"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import type { Transaction } from "@/types";

interface PaymentExpiredCardProps {
  tx: Transaction;
}

export function PaymentExpiredCard({ tx }: PaymentExpiredCardProps) {
  return (
    <div className="card overflow-hidden border border-brand-200/80 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/70 text-3xl text-amber-700">
        ⏰
      </div>

      <span className="mt-4 inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
        Tagihan Kedaluwarsa
      </span>

      <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-brand-950">
        Waktu Pembayaran Telah Berakhir
      </h1>

      <p className="mx-auto mt-2 max-w-md text-sm text-brand-600">
        Batas waktu pembayaran untuk transaksi{" "}
        <span className="font-mono font-semibold text-brand-800">{tx.id}</span> telah
        habis. Tenang, dana Anda tidak terdebet atau terpotong sama sekali.
      </p>

      {/* Ringkasan Ringkas */}
      <div className="mx-auto mt-6 max-w-sm rounded-xl bg-brand-50/70 p-4 text-left text-xs text-brand-700">
        <div className="flex justify-between py-1">
          <span className="text-brand-500">Program</span>
          <span className="font-medium text-brand-900 text-right line-clamp-1">
            {tx.programNama}
          </span>
        </div>
        <div className="flex justify-between py-1 border-t border-brand-100">
          <span className="text-brand-500">Nominal</span>
          <span className="font-semibold text-brand-900">
            {formatRupiah(tx.nominal)}
          </span>
        </div>
      </div>

      {/* Tindakan Cepat */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/program/${tx.programId}?nominal=${tx.nominal}`}
          className="btn-primary px-6 py-2.5 text-sm font-semibold shadow-sm"
        >
          Ulangi Wakaf untuk Program Ini
        </Link>
        <Link
          href="/program"
          className="btn-outline px-6 py-2.5 text-sm font-semibold"
        >
          Lihat Program Lain
        </Link>
      </div>

      <p className="mt-6 text-xs text-brand-400">
        Ada kendala saat pembayaran?{" "}
        <a
          href="https://wa.me/6281234567890?text=Halo%20Admin%20KBM,%20saya%20mengalami%20kendala%20saat%20pembayaran%20wakaf."
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 underline hover:text-brand-900"
        >
          Hubungi Layanan Donatur KBM
        </a>
      </p>
    </div>
  );
}
