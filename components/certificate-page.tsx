"use client";

import Link from "next/link";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { CertificateView } from "@/components/certificate-view";
import { EmptyState } from "@/components/atoms/EmptyState";

export function CertificatePage({ certId }: { certId: string }) {
  // certId dari URL sudah ter-encode (mengandung "/"). Decode untuk request.
  const decoded = decodeURIComponent(certId);
  const { data: cert, loading, error } = useAsync(
    () => api.getCertificate(decoded),
    [decoded],
  );

  return (
    <div className="container-app max-w-3xl py-10">
      <nav className="no-print mb-4 text-sm text-brand-500">
        <Link href="/riwayat" className="hover:text-brand-800">
          Riwayat
        </Link>{" "}
        / <span className="text-brand-700">Sertifikat</span>
      </nav>

      {loading ? (
        <div className="skeleton h-[420px] w-full rounded-2xl" />
      ) : error || !cert ? (
        <EmptyState
          title="Sertifikat tidak ditemukan"
          desc={`Tidak ada sertifikat dengan nomor "${decoded}".`}
          action={
            <Link href="/verifikasi" className="btn-primary">
              Coba verifikasi manual
            </Link>
          }
        />
      ) : (
        <CertificateView cert={cert} />
      )}
    </div>
  );
}
