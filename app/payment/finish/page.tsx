import { Suspense } from "react";
import { PaymentFinishHandler } from "./PaymentFinishHandler";

export default function PaymentFinishPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-lg font-bold text-brand-950 font-serif">Memverifikasi Transaksi...</h1>
          <p className="text-sm text-brand-600 mt-2">Mohon tunggu sebentar, kami sedang mensinkronkan data dengan Midtrans.</p>
        </div>
      }>
        <PaymentFinishHandler />
      </Suspense>
    </div>
  );
}
