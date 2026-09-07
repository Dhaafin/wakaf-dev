"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah } from "@/lib/format";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/empty-state";
import { useSession } from "@/lib/store/session";
import { PROGRAM_TYPE_TERMS } from "@/types";

export function PaymentSuccess({ txId }: { txId: string }) {
  const router = useRouter();
  const loginWakif = useSession((s) => s.loginWakif);
  const { data: tx, loading, error } = useAsync(
    () => api.getTransaction(txId),
    [txId],
  );
  const linkedRef = useRef(false);

  // Begitu sukses, "kenali" wakif ini supaya halaman Riwayat langsung terisi
  // tanpa harus login manual (email dari transaksi).
  useEffect(() => {
    if (tx?.status === "paid" && !linkedRef.current) {
      linkedRef.current = true;
      loginWakif({ email: tx.emailWakif, nama: tx.namaWakif });
    }
  }, [tx, loginWakif]);

  useEffect(() => {
    if (tx && tx.status !== "paid") {
      router.replace(`/wakaf/${tx.id}`);
    }
  }, [tx, router]);

  if (loading) {
    return (
      <div className="container-app max-w-2xl py-16 text-center">
        <Spinner className="mx-auto h-6 w-6 text-brand-600" />
        <p className="mt-3 text-sm text-brand-600">Memuat konfirmasi…</p>
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="container-app max-w-2xl py-16">
        <EmptyState
          title="Transaksi tidak ditemukan"
          action={
            <Link href="/program" className="btn-primary">
              Kembali ke program
            </Link>
          }
        />
      </div>
    );
  }

  // Istilah menyesuaikan jenis program (wakaf / infaq / zakat).
  const terms = PROGRAM_TYPE_TERMS[tx.program_type];

  return (
    <div className="container-app max-w-2xl py-10">
      <div className="card overflow-hidden">
        <div className="bg-brand-900 p-8 text-center text-white">
          <div className="mx-auto flex h-16 w-16 animate-fade-in items-center justify-center rounded-full bg-white/15 text-3xl">
            ✓
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold">
            {terms.pemberi === "Muzakki"
              ? "Zakat Anda tercatat"
              : terms.pemberi === "Donatur"
                ? "Donasi Anda tercatat"
                : "Wakaf Anda tercatat"}
          </h1>
          <p className="mt-1 text-sm text-brand-100/90">
            Jazākumullāhu khairan. Semoga menjadi amal jariyah yang tak terputus.
          </p>
        </div>

        <div className="p-6">
          <dl className="space-y-2 text-sm">
            <Row k="Nomor transaksi" v={<span className="font-mono">{tx.id}</span>} />
            <Row k="Program" v={tx.programNama} />
            <Row
              k="Nominal"
              v={
                <span className="font-serif text-base font-bold text-brand-900">
                  {formatRupiah(tx.nominal)}
                </span>
              }
            />
            <Row
              k="Atas nama"
              v={tx.atasNama === "orang-lain" ? tx.namaAtasNama : tx.namaWakif}
            />
            <Row
              k="Ditampilkan sebagai"
              v={tx.visibilitas === "anonim" ? "Anonim" : "Publik"}
            />
            {tx.doa && <Row k="Doa" v={<span className="italic">“{tx.doa}”</span>} />}
          </dl>

          <div className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
            Progres program{" "}
            <span className="font-semibold">{tx.programNama}</span> sudah
            diperbarui dengan wakaf Anda. Cek langsung di halaman program.
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={`/sertifikat/${encodeURIComponent(tx.certificateId ?? "")}`}
              className="btn-primary w-full"
            >
              Lihat &amp; unduh {terms.bukti.toLowerCase()}
            </Link>
            <Link
              href={`/program/${tx.programId}`}
              className="btn-outline w-full"
            >
              Lihat progres program
            </Link>
          </div>
          <Link
            href="/riwayat"
            className="mt-3 block text-center text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            Buka riwayat saya →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-brand-50 pb-2">
      <dt className="text-brand-500">{k}</dt>
      <dd className="text-right font-medium text-brand-900">{v}</dd>
    </div>
  );
}
