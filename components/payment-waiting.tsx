"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Transaction } from "@/types";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { VA_TTL_LABEL } from "@/lib/config";
import { Countdown } from "@/components/countdown";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/lib/store/toast";

export function PaymentWaiting({ txId }: { txId: string }) {
  const router = useRouter();
  const { push } = useToast();
  const { data, loading, error, setData } = useAsync(
    () => api.getTransaction(txId),
    [txId],
  );
  const [simulating, setSimulating] = useState(false);
  const [expiring, setExpiring] = useState(false);
  const [copied, setCopied] = useState(false);
  const redirectedRef = useRef(false);

  const tx = data;

  // Kalau transaksi ternyata sudah "paid" (mis. dibuka ulang), langsung ke sukses.
  useEffect(() => {
    if (tx?.status === "paid" && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace(`/sukses/${tx.id}`);
    }
  }, [tx?.status, tx?.id, router]);

  // Polling ringan: meniru halaman yang menunggu notifikasi webhook dari gateway.
  useEffect(() => {
    if (!tx || tx.status !== "pending") return;
    const id = setInterval(async () => {
      try {
        const fresh = await api.getTransaction(txId);
        setData(fresh);
      } catch {
        /* abaikan error polling */
      }
    }, 5000);
    return () => clearInterval(id);
  }, [tx, txId, setData]);

  async function handleSimulatePayment() {
    if (!tx || simulating) return;
    setSimulating(true);
    try {
      // Memanggil mock "webhook": POST /api/transactions/:id/pay
      const res = await api.simulatePayment(tx.id);
      setData(res.transaction);
      push({
        kind: "success",
        title: "Pembayaran diterima",
        desc: "Status transaksi kini LUNAS. Mengalihkan ke halaman sukses…",
      });
      redirectedRef.current = true;
      setTimeout(() => router.replace(`/sukses/${tx.id}`), 900);
    } catch (e) {
      push({
        kind: "error",
        title: "Simulasi pembayaran gagal",
        desc: e instanceof Error ? e.message : undefined,
      });
      setSimulating(false);
    }
  }

  const handleExpire = useCallback(async () => {
    if (!tx || tx.status !== "pending" || expiring) return;
    setExpiring(true);
    try {
      const updated = await api.expireTransaction(tx.id);
      setData(updated);
      push({
        kind: "info",
        title: "Waktu pembayaran habis",
        desc: "Nomor VA kedaluwarsa. Silakan buat tagihan baru.",
      });
    } catch {
      /* mungkin sudah dibayar di tab lain */
    } finally {
      setExpiring(false);
    }
  }, [tx, expiring, setData, push]);

  function copyVa() {
    if (!tx) return;
    navigator.clipboard?.writeText(tx.vaNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  // ----------------------------- Render ------------------------------

  if (loading) {
    return (
      <div className="container-app max-w-2xl py-12">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton mt-4 h-40 w-full rounded-2xl" />
        <div className="skeleton mt-4 h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="container-app max-w-2xl py-16">
        <EmptyState
          title="Transaksi tidak ditemukan"
          desc="Tautan pembayaran mungkin sudah tidak berlaku."
          action={
            <Link href="/program" className="btn-primary">
              Kembali ke program
            </Link>
          }
        />
      </div>
    );
  }

  if (tx.status === "expired") {
    return (
      <div className="container-app max-w-2xl py-12">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
            ⏰
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-brand-950">
            Waktu pembayaran habis
          </h1>
          <p className="mt-2 text-sm text-brand-600">
            Nomor Virtual Account untuk transaksi{" "}
            <span className="font-mono">{tx.id}</span> sudah kedaluwarsa dan
            tidak dapat dibayar lagi. Wakaf Anda belum tercatat.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/program/${tx.programId}`}
              className="btn-primary"
            >
              Ulangi wakaf untuk program ini
            </Link>
            <Link href="/program" className="btn-outline">
              Pilih program lain
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (tx.status === "paid") {
    return (
      <div className="container-app max-w-2xl py-16 text-center">
        <Spinner className="mx-auto h-6 w-6 text-brand-600" />
        <p className="mt-3 text-sm text-brand-600">
          Pembayaran terkonfirmasi. Mengalihkan ke halaman sukses…
        </p>
      </div>
    );
  }

  // status === "pending"
  return (
    <div className="container-app max-w-2xl py-10">
      <div className="mb-2 flex items-center gap-2 text-sm text-brand-500">
        <span className="badge bg-amber-100 text-amber-800">
          ● Menunggu pembayaran
        </span>
        <span className="font-mono">{tx.id}</span>
      </div>
      <h1 className="font-serif text-3xl font-bold text-brand-950">
        Selesaikan pembayaran
      </h1>
      <p className="mt-1 text-sm text-brand-600">
        Transfer tepat sejumlah di bawah ke nomor Virtual Account berikut.
      </p>

      {/* Countdown */}
      <div className="mt-6">
        <p className="mb-2 text-center text-xs font-medium text-brand-500">
          Sisa waktu pembayaran
        </p>
        <Countdown expiresAt={tx.expiresAt} onExpire={handleExpire} />
        <p className="mt-2 text-center text-[11px] text-brand-400">
          {/* CATATAN DEMO: durasi ini dipercepat. Lihat lib/config.ts */}
          Masa berlaku VA: {VA_TTL_LABEL}
        </p>
      </div>

      {/* Detail VA */}
      <div className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-500">Bank</span>
          <span className="font-semibold text-brand-900">
            {tx.bank} Virtual Account
          </span>
        </div>
        <div className="mt-3">
          <span className="text-sm text-brand-500">Nomor Virtual Account</span>
          <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-brand-50 px-4 py-3">
            <span className="font-mono text-lg font-bold tracking-wide text-brand-950">
              {tx.vaNumber}
            </span>
            <button
              onClick={copyVa}
              className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm hover:bg-brand-100"
            >
              {copied ? "Tersalin ✓" : "Salin"}
            </button>
          </div>
          {/* Nomor VA di demo ini fiktif & diawali "DEMO" agar tidak bisa
              dipakai di aplikasi bank sungguhan. Lihat lib/mock-db -> makeVaNumber. */}
          <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
            <span aria-hidden>⚠️</span>
            Nomor ini fiktif untuk simulasi — jangan dimasukkan ke aplikasi bank
            / m-banking. Pembayaran dijalankan lewat tombol di bawah.
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-4">
          <span className="text-sm text-brand-500">Total tagihan</span>
          <span className="font-serif text-xl font-bold text-brand-900">
            {formatRupiah(tx.total)}
          </span>
        </div>
        <dl className="mt-3 space-y-1 text-xs text-brand-500">
          <div className="flex justify-between">
            <dt>Program</dt>
            <dd className="text-brand-700">{tx.programNama}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Atas nama</dt>
            <dd className="text-brand-700">
              {tx.atasNama === "orang-lain" ? tx.namaAtasNama : tx.namaWakif}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Dibuat</dt>
            <dd className="text-brand-700">
              {formatTanggalWaktu(tx.createdAt)}
            </dd>
          </div>
        </dl>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* PANEL SIMULASI — KHUSUS DEMO, BUKAN BAGIAN UI PRODUKSI           */}
      {/* Di produksi, status berubah otomatis lewat webhook dari payment  */}
      {/* gateway setelah dana benar-benar masuk.                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-300 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
          🧪 Alat simulasi demo
        </p>
        <p className="mt-1 text-sm text-brand-600">
          Tombol ini menggantikan transfer sungguhan. Menekannya memicu mock
          webhook <span className="font-mono">POST /api/transactions/{"{id}"}/pay</span>{" "}
          yang mengubah status transaksi menjadi <b>LUNAS</b> di mock-db.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleSimulatePayment}
            disabled={simulating}
            className="btn-dark"
          >
            {simulating && <Spinner className="h-4 w-4" />}
            {simulating
              ? "Memproses pembayaran…"
              : "Simulasikan pembayaran berhasil"}
          </button>
          <button
            onClick={handleExpire}
            disabled={expiring}
            className="btn-outline"
          >
            {expiring && <Spinner className="h-4 w-4" />}
            Biarkan kedaluwarsa sekarang
          </button>
        </div>
        <p className="mt-3 text-[11px] text-brand-400">
          Atau cukup diamkan sampai hitung mundur di atas habis — transaksi akan
          otomatis berstatus <i>expired</i>.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-brand-400">
        Sudah membayar tapi status belum berubah? Halaman ini menyegar otomatis
        tiap 5 detik.
      </p>
    </div>
  );
}
