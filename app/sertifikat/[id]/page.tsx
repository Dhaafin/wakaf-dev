import { CertificatePage } from "@/components/certificate-page";

export default function SertifikatPage({
  params,
}: {
  params: { id: string };
}) {
  return <CertificatePage certId={params.id} />;
}
