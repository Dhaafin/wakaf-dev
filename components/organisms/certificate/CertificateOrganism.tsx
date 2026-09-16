"use client";

import Link from "next/link";
import { useCertificate } from "@/hooks/useCertificate";
import { EmptyState } from "@/components/atoms/EmptyState";
import { CertificateCard } from "./molecules/CertificateCard";
import { CertificateActions } from "./molecules/CertificateActions";

export function CertificateOrganism({ certId }: { certId: string }) {
  const {
    cert,
    loading,
    error,
    certId: decodedId,
    downloading,
    handlePrint,
    handleDownloadPdf,
    handleShare,
  } = useCertificate(certId);

  return (
    <div className="container-app max-w-3xl py-8 sm:py-12">
      {/* Navigasi Breadcrumbs */}
      <nav className="no-print mb-6 flex items-center gap-2 text-xs sm:text-sm text-brand-500 font-medium">
        <Link href="/riwayat" className="hover:text-brand-800 transition">
          Riwayat
        </Link>
        <span>/</span>
        <Link href="/verifikasi" className="hover:text-brand-800 transition">
          Verifikasi
        </Link>
        <span>/</span>
        <span className="text-brand-900 font-semibold">Sertifikat Digital</span>
      </nav>

      {/* State Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="skeleton h-[480px] w-full rounded-3xl" />
        </div>
      ) : error || !cert ? (
        /* State Error / Empty */
        <div className="rounded-3xl border border-brand-100 bg-white p-8 sm:p-12 shadow-sm">
          <EmptyState
            title="Sertifikat Tidak Ditemukan"
            desc={`Tidak ditemukan dokumen sertifikat resmi dengan nomor "${decodedId}". Periksa kembali format penulisan nomor sertifikat.`}
            action={
              <Link href="/verifikasi" className="btn-primary">
                Coba Verifikasi Manual
              </Link>
            }
          />
        </div>
      ) : (
        /* State Data Sukses */
        <div className="space-y-6">
          <CertificateCard cert={cert} />
          <CertificateActions
            downloading={downloading}
            onDownloadPdf={handleDownloadPdf}
            onPrint={handlePrint}
            onShare={handleShare}
          />
        </div>
      )}
    </div>
  );
}
