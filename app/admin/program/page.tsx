import type { Metadata } from "next";
import { AdminProgramOrganism } from "@/components/organisms/admin/AdminProgramOrganism";

export const metadata: Metadata = {
  title: "Kelola Program | Admin Yayasan KBM",
  description: "Daftar dan kelola program wakaf, infaq, dan zakat Yayasan Khazanah Berkah Mulia.",
};

export default function AdminProgramPage() {
  return <AdminProgramOrganism />;
}
