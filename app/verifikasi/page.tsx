"use client";

import { useState } from "react";
import Link from "next/link";
import type { Certificate } from "@/types";
import { api, ApiError } from "@/lib/api/client";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { PROGRAM_TYPE_LABEL } from "@/types";
import { Spinner } from "@/components/atoms/Spinner";

export default function VerifikasiPage() {
  const [kode, setKode] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function verifikasi(e: React.FormEvent) {
    e.preventDefault();
    if (!kode.trim() || loading) return;
    setLoading(true);
    setHasil(null);
    setNotFound(false);
    try {
      const cert = await api.getCertificate(kode.trim());
      setHasil(cert);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setNotFound(true);
      else setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app max-w-2xl py-12">
      <h1 className="font-serif text-3xl font-bold text-brand-950">
        Verifikasi Sertifikat Wakaf
      </h1>
      <p className="mt-2 text-sm text-brand-600">
        Masukkan nomor sertifikat (mis. <span className="font-mono">SW/2026/07/000001</span>)
        untuk memastikan keasliannya.
      </p>

      <form onSubmit={verifikasi} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          placeholder="SW/2026/07/000001"
          className="input font-mono"
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading && <Spinner className="h-4 w-4" />}
          Verifikasi
        </button>
      </form>

      {hasil && (
        <div className="mt-6 card animate-fade-in overflow-hidden">
          <div className="flex items-center gap-3 bg-emerald-50 px-6 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
              ✓
            </span>
            <div>
              <p className="font-semibold text-emerald-900">Sertifikat sah</p>
              <p className="text-xs text-emerald-700">
                Tercatat di sistem Yayasan Khazanah Berkah Mulia.
              </p>
            </div>
          </div>
          <dl className="grid gap-3 p-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-brand-400">Nomor sertifikat</dt>
              <dd className="font-mono font-semibold text-brand-900">
                {hasil.id}
              </dd>
            </div>
            <div>
              <dt className="text-brand-400">Tanggal</dt>
              <dd className="font-semibold text-brand-900">
                {formatTanggal(hasil.tanggal)}
              </dd>
            </div>
            <div>
              <dt className="text-brand-400">Atas nama</dt>
              <dd className="font-semibold text-brand-900">{hasil.namaPihak}</dd>
            </div>
            <div>
              <dt className="text-brand-400">Jenis</dt>
              <dd className="font-semibold text-brand-900">
                {PROGRAM_TYPE_LABEL[hasil.program_type]}
              </dd>
            </div>
            <div>
              <dt className="text-brand-400">Program</dt>
              <dd className="font-semibold text-brand-900">
                {hasil.programNama}
              </dd>
            </div>
            <div>
              <dt className="text-brand-400">Nominal</dt>
              <dd className="font-semibold text-brand-900">
                {formatRupiah(hasil.nominal)}
              </dd>
            </div>
          </dl>
          <div className="border-t border-brand-100 px-6 py-4">
            <Link
              href={`/sertifikat/${encodeURIComponent(hasil.id)}`}
              className="text-sm font-semibold text-brand-700 hover:text-brand-900"
            >
              Buka & unduh sertifikat →
            </Link>
          </div>
        </div>
      )}

      {notFound && (
        <div className="mt-6 card animate-fade-in border-red-200 p-6">
          <p className="font-semibold text-red-700">
            ⚠️ Nomor sertifikat tidak ditemukan
          </p>
          <p className="mt-1 text-sm text-brand-600">
            Pastikan penulisan sudah benar, termasuk tanda garis miring.
          </p>
        </div>
      )}
    </div>
  );
}
