import { CertificateOrganism } from "@/components/organisms/certificate/CertificateOrganism";

export default function SertifikatPage({
  params,
}: {
  params: { id: string };
}) {
  return <CertificateOrganism certId={params.id} />;
}

