"use client";

import Link from "next/link";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { PROGRAM_TYPE_TERMS, type Certificate } from "@/types";

interface CertificateCardProps {
  cert: Certificate;
}

export function CertificateCard({ cert }: { cert: Certificate }) {
  const terms = PROGRAM_TYPE_TERMS[cert.program_type];

  return (
    <div
      id="sertifikat"
      className="print-page relative overflow-hidden rounded-3xl border-2 border-brand-700 bg-white p-6 sm:p-12 shadow-lg transition"
    >
      {/* Ornamen Bingkai Ganda & Aksen Sudut */}
      <div className="pointer-events-none absolute inset-3 rounded-2xl border border-brand-200/80" />
      <div className="pointer-events-none absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-brand-600" />
      <div className="pointer-events-none absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-brand-600" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-brand-600" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-brand-600" />

      {/* Watermark Logo Latar Belakang */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <svg className="h-96 w-96 text-brand-900" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative text-center">
        {/* Header Lembaga */}
        <div className="inline-flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-800">
            Yayasan Khazanah Berkah Mulia
          </p>
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
        </div>
        <p className="mt-1 text-[11px] sm:text-xs text-brand-500">
          Terdaftar &amp; Diakui di Badan Wakaf Indonesia (BWI) • SK No. 3.3.00318
        </p>

        {/* Judul Bukti / Sertifikat */}
        <h1 className="mt-6 font-serif text-2xl sm:text-4xl font-bold tracking-tight text-brand-950">
          {terms.bukti}
        </h1>
        <p className="mt-1.5 font-mono text-xs sm:text-sm font-semibold text-brand-600">
          No: {cert.id}
        </p>

        {/* Garis Aksen */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-300" />
          <div className="h-1.5 w-1.5 rotate-45 bg-amber-500" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-300" />
        </div>

        {/* Konten Utama */}
        <div className="mx-auto mt-8 max-w-xl">
          <p className="text-xs sm:text-sm text-brand-600">Diberikan sebagai tanda terima sah kepada:</p>
          <p className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brand-900">
            {cert.namaPihak}
          </p>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-brand-700">
            yang telah menunaikan amanah{" "}
            <span className="font-semibold text-brand-900">{terms.kataKerja}</span> sebesar{" "}
            <span className="font-serif font-bold text-brand-950 text-base sm:text-lg">
              {formatRupiah(cert.nominal)}
            </span>{" "}
            untuk dialokasikan secara transparan pada program{" "}
            <span className="font-semibold text-brand-900">&ldquo;{cert.programNama}&rdquo;</span>.
          </p>
        </div>

        {/* Informasi Detail Sertifikat */}
        <div className="mx-auto mt-8 grid max-w-md grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-brand-50/70 p-4 text-left text-xs sm:text-sm ring-1 ring-brand-100">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-brand-400 font-medium block">
              Tanggal Penerbitan
            </span>
            <span className="font-semibold text-brand-900">
              {formatTanggal(cert.tanggal)}
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-brand-400 font-medium block">
              Lembaga Pengelola
            </span>
            <span className="font-semibold text-brand-900">
              {cert.nazhir}
            </span>
          </div>
        </div>

        {/* Footer Sertifikat */}
        <div className="mt-8 border-t border-brand-100 pt-5 text-center text-[11px] text-brand-400">
          <p>
            Dokumen ini sah diterbitkan secara elektronik oleh Yayasan Khazanah Berkah Mulia.
          </p>
          <p className="mt-1">
            Verifikasi keaslian dapat dicek secara mandiri melalui laman{" "}
            <Link
              href="/verifikasi"
              className="text-brand-700 font-medium underline hover:text-brand-900"
            >
              Verifikasi Sertifikat
            </Link>{" "}
            dengan kode registrasi <span className="font-mono font-semibold text-brand-800">{cert.id}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
