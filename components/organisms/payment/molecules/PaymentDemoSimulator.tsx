"use client";

import { useState } from "react";
import { Spinner } from "@/components/atoms/Spinner";

interface PaymentDemoSimulatorProps {
  onSimulatePayment: () => void;
  onExpire: () => void;
  simulating: boolean;
  expiring: boolean;
}

export function PaymentDemoSimulator({
  onSimulatePayment,
  onExpire,
  simulating,
  expiring,
}: PaymentDemoSimulatorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-4 transition text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-600 font-medium">
          <span>🧪</span>
          <span>Panel Pengujian Developer (Khusus Demo)</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-[11px] font-semibold text-brand-700 hover:text-brand-900 underline"
        >
          {open ? "Sembunyikan" : "Tampilkan Opsi Demo"}
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-brand-200 animate-fade-in text-brand-600">
          <p className="text-[11px] leading-relaxed">
            Gunakan tombol di bawah untuk menguji respon sistem terhadap callback pembayaran instan (lunas) atau simulasi waktu pembayaran habis tanpa perlu melakukan transfer real di sandbox.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSimulatePayment}
              disabled={simulating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-800 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-brand-900 disabled:opacity-50"
            >
              {simulating && <Spinner className="h-3.5 w-3.5" />}
              {simulating ? "Memproses..." : "Simulasikan Lunas"}
            </button>
            <button
              type="button"
              onClick={onExpire}
              disabled={expiring}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-300 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50"
            >
              {expiring && <Spinner className="h-3.5 w-3.5" />}
              {expiring ? "Mengubah..." : "Simulasikan Kedaluwarsa"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
