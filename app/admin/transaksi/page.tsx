import type { Metadata } from "next";
import { AdminTransactionOrganism } from "@/components/organisms/admin/AdminTransactionOrganism";

export const metadata: Metadata = {
  title: "Transaksi Masuk | Admin Yayasan KBM",
  description:
    "Audit dan monitoring transaksi wakaf, infaq, dan zakat digital Yayasan Khazanah Berkah Mulia.",
};

export default function AdminTransaksiPage() {
  return <AdminTransactionOrganism />;
}
