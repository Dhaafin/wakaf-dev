import type { Metadata } from "next";
import { VerificationOrganism } from "@/components/organisms/verification/VerificationOrganism";

export const metadata: Metadata = {
  title: "Verifikasi Sertifikat Wakaf — Yayasan Khazanah Berkah Mulia",
  description:
    "Cek keaslian dan validitas dokumen sertifikat wakaf dan bukti donasi digital resmi Yayasan Khazanah Berkah Mulia.",
};

export default function VerifikasiPage() {
  return <VerificationOrganism />;
}
