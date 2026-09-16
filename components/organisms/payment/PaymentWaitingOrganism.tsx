"use client";

import Link from "next/link";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { usePaymentWaiting } from "@/hooks/usePaymentWaiting";
import { PaymentCountdownCard } from "./molecules/PaymentCountdownCard";
import { PaymentMidtransAction } from "./molecules/PaymentMidtransAction";
import { PaymentInstructions } from "./molecules/PaymentInstructions";
import { PaymentExpiredCard } from "./molecules/PaymentExpiredCard";
import { PaymentDemoSimulator } from "./molecules/PaymentDemoSimulator";

export function PaymentWaitingOrganism({ txId }: { txId: string }) {
  const {
    tx,
    loading,
    error,
    checking,
    simulating,
    expiring,
    handleManualCheck,
    handleOpenMidtrans,
    handleSimulatePayment,
    handleExpire,
  } = usePaymentWaiting(txId);

  if (loading) {
    return (
      <div className="container-app max-w-2xl py-12">
        <div className="skeleton h-8 w-2/3 rounded-lg" />
        <div className="skeleton mt-4 h-36 w-full rounded-2xl" />
        <div className="skeleton mt-4 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="container-app max-w-2xl py-16">
        <EmptyState
          title="Transaksi Tidak Ditemukan"
          desc="Tautan pembayaran mungkin sudah tidak berlaku atau kode transaksi salah."
          action={
            <Link href="/program" className="btn-primary">
              Kembali ke Daftar Program
            </Link>
          }
        />
      </div>
    );
  }

  // 1. Status Expired
  if (tx.status === "expired") {
    return (
      <div className="container-app max-w-2xl py-12">
        <PaymentExpiredCard tx={tx} />
      </div>
    );
  }

  // 2. Status Paid (sementara menunggu redirect)
  if (tx.status === "paid") {
    return (
      <div className="container-app max-w-2xl py-16 text-center">
        <Spinner className="mx-auto h-8 w-8 text-brand-600" />
        <p className="mt-4 font-serif text-lg font-bold text-brand-900">
          Pembayaran Terkonfirmasi!
        </p>
        <p className="mt-1 text-sm text-brand-600">
          Mengalihkan Anda ke tanda terima dan sertifikat wakaf digital…
        </p>
      </div>
    );
  }

  // 3. Status Pending (Menunggu Pembayaran)
  return (
    <div className="container-app max-w-2xl py-10">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-brand-950">
          Selesaikan Pembayaran
        </h1>
        <p className="mt-1 text-sm text-brand-600">
          Tunaikan wakaf Anda melalui gerbang pembayaran aman Midtrans sebelum batas waktu berakhir.
        </p>
      </div>

      <div className="space-y-6">
        {/* Kartu Hitung Mundur */}
        <PaymentCountdownCard
          txId={tx.id}
          expiresAt={tx.expiresAt}
          onExpire={handleExpire}
        />

        {/* Kartu Aksi Utama Midtrans */}
        <PaymentMidtransAction
          tx={tx}
          onOpenMidtrans={handleOpenMidtrans}
          onManualCheck={handleManualCheck}
          checking={checking}
        />

        {/* Panduan Pembayaran */}
        <PaymentInstructions />

        {/* Alat Pengujian Demo Pengembang */}
        <PaymentDemoSimulator
          onSimulatePayment={handleSimulatePayment}
          onExpire={handleExpire}
          simulating={simulating}
          expiring={expiring}
        />
      </div>

      <p className="mt-8 text-center text-xs text-brand-400">
        Butuh bantuan teknis? Hubungi tim amil Khazanah Berkah Mulia melalui saluran resmi kami.
      </p>
    </div>
  );
}
