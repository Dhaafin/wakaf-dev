"use client";

import { useState } from "react";

export function PaymentInstructions() {
  const [activeTab, setActiveTab] = useState<"qris" | "va">("qris");

  return (
    <div className="card overflow-hidden border border-brand-200/80 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-brand-950">
        Panduan Cara Pembayaran
      </h3>
      <p className="mt-1 text-xs text-brand-500">
        Pilih instruksi sesuai metode yang Anda pilih di jendela Midtrans.
      </p>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 border-b border-brand-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("qris")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
            activeTab === "qris"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-brand-50 text-brand-700 hover:bg-brand-100"
          }`}
        >
          QRIS (E-Wallet & Mobile Banking)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("va")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
            activeTab === "va"
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-brand-50 text-brand-700 hover:bg-brand-100"
          }`}
        >
          Virtual Account Bank
        </button>
      </div>

      {/* Content */}
      <div className="mt-4 text-xs text-brand-700">
        {activeTab === "qris" ? (
          <ol className="list-decimal pl-4 space-y-2 leading-relaxed">
            <li>
              Klik tombol <b>Buka Pembayaran Midtrans</b> di atas dan pilih metode <b>GoPay / QRIS</b>.
            </li>
            <li>
              Buka aplikasi mobile banking (BCA, Mandiri Livin, BRImo, BSI Mobile) atau e-wallet (GoPay, OVO, Dana, ShopeePay).
            </li>
            <li>
              Pilih menu <b>Scan / Bayar QRIS</b> lalu arahkan kamera ke kode QR yang muncul di layar.
            </li>
            <li>
              Pastikan nama penerima tertera <b>Khazanah Berkah Mulia / Midtrans</b> dan nominal sesuai.
            </li>
            <li>
              Masukkan PIN Anda. Transaksi akan terverifikasi <b>otomatis dalam hitungan detik</b>.
            </li>
          </ol>
        ) : (
          <ol className="list-decimal pl-4 space-y-2 leading-relaxed">
            <li>
              Klik tombol <b>Buka Pembayaran Midtrans</b> di atas lalu pilih bank tujuan Anda (BCA, Mandiri, BNI, BRI, atau Permata).
            </li>
            <li>
              Salin <b>Nomor Virtual Account</b> yang tertera di jendela Midtrans.
            </li>
            <li>
              Buka aplikasi M-Banking atau ATM, pilih menu <b>Transfer / Pembayaran &gt; Virtual Account</b>.
            </li>
            <li>
              Tempelkan nomor VA dan selesaikan transfer sesuai nominal tagihan yang tertera.
            </li>
            <li>
              Status tagihan pada halaman ini akan langsung berubah menjadi <b>LUNAS</b> tanpa perlu konfirmasi manual.
            </li>
          </ol>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/50 p-3 text-xs text-brand-600 flex items-start gap-2">
        <span className="text-brand-500 shrink-0 mt-0.5">ℹ️</span>
        <p>
          Anda tidak perlu mengunggah foto bukti transfer. Notifikasi pelunasan diproses langsung secara aman oleh gerbang pembayaran resmi.
        </p>
      </div>
    </div>
  );
}
