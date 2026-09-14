"use client";

import Link from "next/link";
import type { Certificate } from "@/types";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { PROGRAM_TYPE_LABEL } from "@/types";

interface VerificationResultCardProps {
  cert: Certificate;
}

export function VerificationResultCard({ cert }: { cert: Certificate }) {
  return (
    <div className="mt-8 card animate-fade-in overflow-hidden border border-emerald-200/80 bg-white shadow-md">
      {/* Header Status Valid */}
      <div className="flex items-center gap-3.5 bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 px-6 py-4.5 border-b border-emerald-100">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white shadow-sm ring-4 ring-emerald-100">
          ✓
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-serif font-bold text-emerald-950 text-base">
              Dokumen Terverifikasi Sah
            </p>
            <span className="inline-flex items-center rounded-md bg-emerald-200/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
              RESMI
            </span>
          </div>
          <p className="text-xs text-emerald-800/90 mt-0.5">
            Sertifikat digital terdaftar sah dalam pangkalan data Yayasan Khazanah Berkah Mulia &amp; BWI.
          </p>
        </div>
      </div>

      {/* Rincian Sertifikat */}
      <dl className="grid gap-4 p-6 sm:grid-cols-2 text-xs sm:text-sm">
        <div>
          <dt className="text-brand-400 text-xs uppercase tracking-wider font-medium">
            Nomor Registrasi
          </dt>
          <dd className="font-mono font-bold text-brand-950 mt-1">
            {cert.id}
          </dd>
        </div>
        <div>
          <dt className="text-brand-400 text-xs uppercase tracking-wider font-medium">
            Tanggal Penerbitan
          </dt>
          <dd className="font-semibold text-brand-900 mt-1">
            {formatTanggal(cert.tanggal)}
          </dd>
        </div>
        <div>
          <dt className="text-brand-400 text-xs uppercase tracking-wider font-medium">
            Atas Nama
          </dt>
          <dd className="font-serif font-bold text-brand-900 text-base mt-0.5">
            {cert.namaPihak}
          </dd>
        </div>
        <div>
          <dt className="text-brand-400 text-xs uppercase tracking-wider font-medium">
            Jenis Program
          </dt>
          <dd className="font-semibold text-brand-900 mt-1">
            {PROGRAM_TYPE_LABEL[cert.program_type]}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-brand-400 text-xs uppercase tracking-wider font-medium">
            Program Alokasi
          </dt>
          <dd className="font-medium text-brand-900 mt-1">
            {cert.programNama}
          </dd>
        </div>
        <div>
          <dt className="text-brand-400 text-xs uppercase tracking-wider font-medium">
            Nominal Ditunaikan
          </dt>
          <dd className="font-serif font-bold text-brand-950 text-base sm:text-lg mt-0.5">
            {formatRupiah(cert.nominal)}
          </dd>
        </div>
        <div>
          <dt className="text-brand-400 text-xs uppercase tracking-wider font-medium">
            Lembaga Nazhir
          </dt>
          <dd className="font-semibold text-brand-900 mt-1">
            {cert.nazhir}
          </dd>
        </div>
      </dl>

      {/* Footer Aksi Buka Dokumen */}
      <div className="border-t border-brand-100 bg-brand-50/50 px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-brand-500">
          Ingin melihat tampilan dokumen sertifikat lengkap?
        </span>
        <Link
          href={`/sertifikat/${encodeURIComponent(cert.id)}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-800 hover:text-brand-950 transition hover:underline"
        >
          <span>Buka &amp; Unduh Sertifikat</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
