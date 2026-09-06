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
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/empty-state";

export default function RiwayatPage() {
  const wakif = useSession((s) => s.wakif);
  const logoutWakif = useSession((s) => s.logoutWakif);

  if (!wakif) return <WakifLogin />;

  return (
    <div className="container-app max-w-3xl py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-950">
            Riwayat Wakaf
          </h1>
          <p className="mt-1 text-sm text-brand-600">
            Masuk sebagai{" "}
            <span className="font-medium text-brand-800">{wakif.email}</span>
          </p>
        </div>
        <button onClick={logoutWakif} className="btn-ghost text-xs">
          Keluar
        </button>
      </div>

      <RiwayatList email={wakif.email} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// LOGIN WAKIF (mock) — email + OTP dummy. Kode "123456" selalu diterima.
// ---------------------------------------------------------------------------
function WakifLogin() {
  const loginWakif = useSession((s) => s.loginWakif);
  const { push } = useToast();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function kirimOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: "Format email tidak valid." });
      return;
    }
    setLoading(true);
    // Mock: tidak benar-benar mengirim OTP, hanya jeda lalu pindah langkah.
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep("otp");
    push({
      kind: "info",
      title: "Kode OTP terkirim (demo)",
      desc: `Gunakan kode ${DEMO_OTP} untuk masuk.`,
    });
  }

  async function verifikasiOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const res = await api.wakifLogin(email.trim(), otp.trim());
      loginWakif({ email: res.email, nama: res.nama });
      push({ kind: "success", title: "Berhasil masuk" });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      else push({ kind: "error", title: "Login gagal" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app max-w-md py-16">
      <div className="card p-8">
        <h1 className="font-serif text-2xl font-bold text-brand-950">
          Masuk untuk lihat riwayat
        </h1>
        <p className="mt-1 text-sm text-brand-600">
          Tanpa kata sandi. Masukkan email yang Anda pakai saat berwakaf.
        </p>

        {step === "email" ? (
          <form onSubmit={kirimOtp} className="mt-6 space-y-3">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className={`input ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
              <p className="mt-1 text-xs text-brand-400">
                Coba <span className="font-mono">wakif@contoh.id</span> untuk
                melihat data riwayat contoh.
              </p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading && <Spinner className="h-4 w-4" />}
              Kirim kode OTP
            </button>
          </form>
        ) : (
          <form onSubmit={verifikasiOtp} className="mt-6 space-y-3">
            <div>
              <label htmlFor="otp" className="label">
                Kode OTP
              </label>
              <input
                id="otp"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6 digit"
                className={`input text-center font-mono text-lg tracking-[0.5em] ${
                  errors.otp ? "input-error" : ""
                }`}
              />
              {errors.otp && <p className="field-error">{errors.otp}</p>}
              <p className="mt-1 text-xs text-brand-400">
                Demo: kode selalu <span className="font-mono">{DEMO_OTP}</span>.
              </p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading && <Spinner className="h-4 w-4" />}
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="btn-ghost w-full text-xs"
            >
              Ganti email
            </button>
          </form>
        )}
      </div>
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
          title="Belum ada wakaf"
          desc="Riwayat wakaf Anda akan muncul di sini setelah transaksi pertama."
          action={
            <Link href="/program" className="btn-primary">
              Mulai berwakaf
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
          <p className="text-xs text-brand-500">Total wakaf tersalur</p>
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
          <p className="font-semibold text-brand-950">{t.programNama}</p>
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
              Lihat sertifikat
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
              Wakaf ulang
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
