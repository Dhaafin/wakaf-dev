"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";

export function PaymentFinishHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    
    if (!orderId) {
      router.replace("/riwayat");
      return;
    }

    processed.current = true;

    async function verifyPayment() {
      try {
        // Handshake aman: kita minta server KBM untuk cek status asli ke Midtrans
        const tx = await api.syncTransaction(orderId as string);
        
        if (tx.status === "paid") {
          router.replace(`/sukses/${tx.id}`);
        } else {
          router.replace(`/wakaf/${tx.id}`);
        }
      } catch (error) {
        console.error("Gagal verifikasi payment:", error);
        // Fallback jika gagal sync
        router.replace(`/wakaf/${orderId}`);
      }
    }

    verifyPayment();
  }, [orderId, router]);

  return (
    <div className="text-center animate-pulse">
      <div className="h-12 w-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
      <h1 className="text-lg font-bold text-brand-950 font-serif">Memverifikasi Transaksi...</h1>
      <p className="text-sm text-brand-600 mt-2">Mohon tunggu sebentar, kami sedang mensinkronkan data dengan Midtrans.</p>
    </div>
  );
}
