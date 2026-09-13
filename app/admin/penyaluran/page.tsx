import type { Metadata } from "next";
import { AdminDisbursementOrganism } from "@/components/organisms/admin/AdminDisbursementOrganism";

export const metadata: Metadata = {
  title: "Penyaluran Dana | Admin Yayasan KBM",
  description:
    "Laporan dan pencatatan penyaluran dana wakaf dan zakat Yayasan Khazanah Berkah Mulia.",
};

export default function AdminPenyaluranPage() {
  return <AdminDisbursementOrganism />;
}
