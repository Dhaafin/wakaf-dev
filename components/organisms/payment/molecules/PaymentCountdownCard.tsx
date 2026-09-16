"use client";

import { Countdown } from "@/components/countdown";
import { VA_TTL_LABEL } from "@/lib/config";

interface PaymentCountdownCardProps {
  txId: string;
  expiresAt: string;
  onExpire: () => void;
}

export function PaymentCountdownCard({
  txId,
  expiresAt,
  onExpire,
}: PaymentCountdownCardProps) {
  return (
    <div className="card overflow-hidden border border-brand-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-100 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Menunggu Pembayaran
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-brand-500 tracking-wide">
          ID: {txId}
        </span>
      </div>

      <div className="pt-5 text-center">
        <p className="text-xs font-medium text-brand-500">
          Sisa Batas Waktu Pembayaran
        </p>
        <div className="mt-3 flex justify-center">
          <Countdown expiresAt={expiresAt} onExpire={onExpire} />
        </div>
        <p className="mt-3 text-[11px] text-brand-400">
          Selesaikan sebelum waktu di atas habis. Durasi berlaku: {VA_TTL_LABEL}
        </p>
      </div>
    </div>
  );
}
