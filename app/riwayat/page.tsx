"use client";

import { useState } from "react";
import Link from "next/link";
import type { Transaction } from "@/types";
import { api, ApiError } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/lib/store/toast";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { DEMO_OTP } from "@/lib/config";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/atoms/EmptyState";
import { PROGRAM_TYPE_LABEL, PROGRAM_TYPE_TERMS } from "@/types";

import { useSession as useBetterAuthSession, signOut } from "@/lib/auth-client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RiwayatPage() {
  const { data: authSession, isPending } = useBetterAuthSession();
  const wakif = useSession((s) => s.wakif);
  const logoutWakif = useSession((s) => s.logoutWakif);
  const router = useRouter();

  const currentUser = authSession?.user
    ? { email: authSession.user.email, nama: authSession.user.name || authSession.user.email }
    : wakif;

  useEffect(() => {
    if (!isPending && !currentUser) {
      router.replace("/login");
    }
  }, [isPending, currentUser, router]);

  if (isPending || !currentUser) {
    return (
      <div className="container-app flex max-w-3xl items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    );
  }

  async function handleLogout() {
    if (authSession) {
      await signOut();
    }
    logoutWakif();
  }

  return (
    <div className="container-app max-w-3xl py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950">
            Riwayat Transaksi
          </h1>
          <p className="mt-1 text-sm text-brand-600">
            Masuk sebagai{" "}
            <span className="font-medium text-brand-800">{currentUser.email}</span>
          </p>
        </div>
        <button onClick={handleLogout} className="btn-ghost text-xs">
          Keluar
        </button>
      </div>

      <RiwayatList email={currentUser.email} />
    </div>
  );
}

// ---------------------------------------------------------------------------
function RiwayatList({ email }: { email: string }) {
  const { data, loading, error, refetch } = useAsync(
    () => api.listTransactionsByEmail(email),
    [email],
  );

  if (loading) {
    return (
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) return <p className="mt-8 text-sm text-red-600">{error}</p>;

  const txs = data ?? [];
  if (txs.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="Belum ada transaksi"
          desc="Riwayat wakaf, infaq, dan zakat Anda akan muncul di sini setelah transaksi pertama."
          action={
            <Link href="/program" className="btn-primary">
              Lihat program
            </Link>
          }
        />
      </div>
    );
  }

  const totalWakaf = txs
    .filter((t) => t.status === "paid")
    .reduce((s, t) => s + t.nominal, 0);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="card flex-1 p-4">
          <p className="text-xs text-brand-500">Total tersalur</p>
          <p className="font-serif text-xl font-bold text-brand-800">
            {formatRupiah(totalWakaf)}
          </p>
        </div>
        <div className="card flex-1 p-4">
          <p className="text-xs text-brand-500">Jumlah transaksi</p>
          <p className="font-serif text-xl font-bold text-brand-800">
            {txs.length}
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {txs.map((t) => (
          <RiwayatItem key={t.id} t={t} />
        ))}
      </ul>
      <button
        onClick={refetch}
        className="btn-ghost mt-4 text-xs"
      >
        ↻ Segarkan riwayat
      </button>
    </>
  );
}

function statusBadge(s: Transaction["status"]) {
  const map = {
    paid: ["bg-emerald-100 text-emerald-800", "Lunas"],
    pending: ["bg-amber-100 text-amber-800", "Menunggu pembayaran"],
    expired: ["bg-red-100 text-red-700", "Kedaluwarsa"],
  } as const;
  const [cls, label] = map[s];
  return <span className={`badge ${cls}`}>{label}</span>;
}

function RiwayatItem({ t }: { t: Transaction }) {
  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="badge bg-brand-50 text-brand-700">
            {PROGRAM_TYPE_LABEL[t.program_type]}
          </span>
          <p className="mt-1 font-semibold text-brand-950">{t.programNama}</p>
          <p className="mt-0.5 text-xs text-brand-500">
            {formatTanggalWaktu(t.createdAt)} · <span className="font-mono">{t.id}</span>
          </p>
        </div>
        {statusBadge(t.status)}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-serif text-lg font-bold text-brand-900">
          {formatRupiah(t.nominal)}
        </p>
        <div className="flex flex-wrap gap-2">
          {t.status === "paid" && t.certificateId && (
            <Link
              href={`/sertifikat/${encodeURIComponent(t.certificateId)}`}
              className="btn-outline px-3 py-2 text-xs"
            >
              Lihat {PROGRAM_TYPE_TERMS[t.program_type].bukti.toLowerCase()}
            </Link>
          )}
          {t.status === "pending" && (
            <Link
              href={`/wakaf/${t.id}`}
              className="btn-primary px-3 py-2 text-xs"
            >
              Lanjutkan pembayaran
            </Link>
          )}
          {t.status === "expired" && (
            <Link
              href={`/program/${t.programId}`}
              className="btn-outline px-3 py-2 text-xs"
            >
              Ulangi
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
