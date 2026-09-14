"use client";

import { useVerification } from "@/hooks/useVerification";
import { VerificationForm } from "./molecules/VerificationForm";
import { VerificationResultCard } from "./molecules/VerificationResultCard";

export function VerificationOrganism() {
  const {
    kode,
    setKode,
    loading,
    hasil,
    notFound,
    handleVerify,
  } = useVerification();

  return (
    <div className="container-app max-w-2xl py-12">
      {/* Header Halaman */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          <span>🛡️</span>
          <span>Transparansi &amp; Legalitas Resmi</span>
        </div>
        <h1 className="mt-3 font-serif text-3xl font-bold text-brand-950">
          Verifikasi Sertifikat Wakaf
        </h1>
        <p className="mt-2 text-sm text-brand-600 leading-relaxed">
          Masukkan nomor registrasi sertifikat (mis.{" "}
          <span className="font-mono font-semibold text-brand-800">
            SW/2026/09/XXXXXX
          </span>
          ) untuk memeriksa validitas dan keaslian dokumen di pangkalan data resmi Yayasan Khazanah Berkah Mulia.
        </p>
      </div>

      {/* Formulir Pencarian */}
      <VerificationForm
        kode={kode}
        onChange={setKode}
        onSubmit={handleVerify}
        loading={loading}
      />

      {/* Hasil Terverifikasi */}
      {hasil && <VerificationResultCard cert={hasil} />}

      {/* Hasil Tidak Ditemukan */}
      {notFound && (
        <div className="mt-8 card animate-fade-in border-rose-200 bg-rose-50/50 p-6 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-rose-950 text-base">
                Nomor Sertifikat Tidak Ditemukan
              </p>
              <p className="mt-1 text-rose-800/90 leading-relaxed text-xs sm:text-sm">
                Sistem tidak dapat menemukan sertifikat dengan nomor &ldquo;
                <span className="font-mono font-semibold">{kode}</span>&rdquo;.
                Pastikan seluruh karakter sudah sesuai, termasuk tanda garis miring (/) dan huruf besar/kecil.
              </p>
              <p className="mt-3 text-xs text-rose-700">
                Jika Anda yakin pembayaran sudah lunas namun sertifikat belum terbit, hubungi tim amil melalui pusat bantuan resmi kami.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Catatan Legalitas Bawah */}
      <div className="mt-12 rounded-2xl border border-brand-100 bg-brand-50/40 p-4 text-center text-xs text-brand-500">
        Yayasan Khazanah Berkah Mulia merupakan Lembaga Nazhir Wakaf Uang yang terdaftar dan diawasi oleh Badan Wakaf Indonesia (BWI).
      </div>
    </div>
  );
}
