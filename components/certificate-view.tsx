"use client";

import { CertificateCard } from "@/components/organisms/certificate/molecules/CertificateCard";
import { CertificateActions } from "@/components/organisms/certificate/molecules/CertificateActions";
import { useCertificate } from "@/hooks/useCertificate";
import type { Certificate } from "@/types";

/**
 * Wrapper backward-compatible untuk CertificateView
 * @deprecated Gunakan `CertificateCard` & `CertificateActions` atau `CertificateOrganism` dari `@/components/organisms/certificate/`
 */
export function CertificateView({ cert }: { cert: Certificate }) {
  const { downloading, handleDownloadPdf, handlePrint, handleShare } =
    useCertificate(cert.id);

  return (
    <div className="space-y-6">
      <CertificateCard cert={cert} />
      <CertificateActions
        downloading={downloading}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
        onShare={handleShare}
      />
    </div>
  );
}
