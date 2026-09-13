"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/atoms/EmptyState";
import { useSession } from "@/lib/store/session";
import { PROGRAM_TYPE_TERMS } from "@/types";

export function PaymentSuccessOrganism({ txId }: { txId: string }) {
  const router = useRouter();
  const loginWakif = useSession((s) => s.loginWakif);
  const { data: tx, loading, error } = useAsync(
    () => api.getTransaction(txId),
    [txId],
  );
  const linkedRef = useRef(false);

  // Begitu sukses, "kenali" wakif ini supaya riwayat langsung terisi
  useEffect(() => {
    if (tx?.status === "paid" && !linkedRef.current) {
      linkedRef.current = true;
      loginWakif({ email: tx.emailWakif, nama: tx.namaWakif });
    }
  }, [tx, loginWakif]);

  // Jika status belum paid (misal buka manual URL sukses), kembalikan ke /wakaf/:id
  useEffect(() => {
    if (tx && tx.status !== "paid") {
      router.replace(`/wakaf/${tx.id}`);
    }
  }, [tx, router]);

  if (loading) {
    return (
      <div className="container-app max-w-2xl py-16 text-center">
        <Spinner className="mx-auto h-8 w-8 text-brand-600" />
        <p className="mt-3 text-sm text-brand-600">Memuat bukti pembayaran…</p>
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="container-app max-w-2xl py-16">
        <EmptyState
          title="Transaksi Tidak Ditemukan"
          desc="Tautan bukti pembayaran tidak ditemukan atau telah kedaluwarsa."
          action={
            <Link href="/program" className="btn-primary">
              Kembali ke Program
            </Link>
          }
        />
      </div>
    );
  }

  const terms = PROGRAM_TYPE_TERMS[tx.program_type];

  // Helper URL share WhatsApp
  const shareText = encodeURIComponent(
    `Alhamdulillah, saya telah menyalurkan donasi untuk program "${tx.programNama}" melalui Yayasan Khazanah Berkah Mulia. Semoga membawa keberkahan dan menjadi amal jariyah. Mari ikut berkontribusi bersama kami!`,
  );
  const waShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div className="container-app max-w-2xl py-10">
      <div className="card overflow-hidden border border-brand-200/80 bg-white shadow-md">
        {/* Header Sukses Hijau Zamrud */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 ring-8 ring-emerald-500/10 text-3xl text-emerald-400">
            ✓
          </div>
          <h1 className="mt-4 font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            {terms.pemberi === "Muzakki"
              ? "Zakat Anda Berhasil Diterima"
              : terms.pemberi === "Donatur"
                ? "Donasi Anda Berhasil Diterima"
                : "Wakaf Anda Berhasil Ditunaikan"}
          </h1>
          <p className="mt-2 text-sm text-brand-100/90 max-w-md mx-auto leading-relaxed">
            Jazākumullāhu khairan katsīran. Amanah Anda telah tercatat sah dalam sistem dan segera disalurkan sesuai akad.
          </p>
        </div>

        {/* Isi Rincian */}
        <div className="p-6 sm:p-8">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs sm:text-sm text-emerald-900 flex items-center justify-between gap-3">
            <div>
              <span className="font-semibold block">Akad Wakaf Sah &amp; Terverifikasi</span>
              <span className="text-emerald-700 text-xs">
                Dana terverifikasi otomatis via gerbang pembayaran Midtrans.
              </span>
            </div>
            <span className="shrink-0 font-mono text-xs font-bold bg-emerald-100/80 text-emerald-800 px-2.5 py-1 rounded-md">
              LUNAS
            </span>
          </div>

          <dl className="mt-6 space-y-3 text-xs sm:text-sm">
            <Row
              k="Nomor Transaksi"
              v={<span className="font-mono font-bold text-brand-900">{tx.id}</span>}
            />
            <Row
              k="Program Tujuan"
              v={
                <Link
                  href={`/program/${tx.programId}`}
                  className="hover:text-brand-700 underline decoration-brand-300 underline-offset-2 font-medium"
                >
                  {tx.programNama}
                </Link>
              }
            />
            <Row
              k="Nominal Ditunaikan"
              v={
                <span className="font-serif text-base sm:text-lg font-bold text-brand-900">
                  {formatRupiah(tx.nominal)}
                </span>
              }
            />
            <Row
              k="Atas Nama"
              v={tx.atasNama === "orang-lain" ? tx.namaAtasNama : tx.namaWakif}
            />
            <Row
              k="Visibilitas Donatur"
              v={tx.visibilitas === "anonim" ? "Hamba Allah (Anonim)" : "Publik"}
            />
            {tx.paidAt && (
              <Row
                k="Waktu Pelunasan"
                v={formatTanggalWaktu(tx.paidAt)}
              />
            )}
            {tx.doa && (
              <div className="pt-2 border-t border-brand-50">
                <dt className="text-brand-500 mb-1">Doa &amp; Pesan Kebaikan</dt>
                <dd className="rounded-lg bg-brand-50/70 p-3 italic text-brand-800 text-xs sm:text-sm leading-relaxed">
                  “{tx.doa}”
                </dd>
              </div>
            )}
          </dl>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/sertifikat/${encodeURIComponent(tx.certificateId ?? tx.id)}`}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-semibold shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Unduh {terms.bukti}</span>
              </Link>
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3 flex items-center justify-center gap-2 font-semibold text-brand-800 border-brand-300 hover:bg-brand-50"
              >
                <span className="text-emerald-600">💬</span>
                <span>Bagikan ke WhatsApp</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-brand-100 text-xs text-brand-600">
              <Link
                href={`/program/${tx.programId}`}
                className="hover:text-brand-900 font-semibold"
              >
                ← Pantau Perkembangan Program
              </Link>
              <Link
                href="/riwayat"
                className="hover:text-brand-900 font-semibold"
              >
                Buka Riwayat Donasi Saya →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brand-50 pb-2.5">
      <dt className="text-brand-500">{k}</dt>
      <dd className="text-right font-medium text-brand-900">{v}</dd>
    </div>
  );
}
