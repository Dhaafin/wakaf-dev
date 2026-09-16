import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminDashboardOrganism } from "@/components/organisms/admin/AdminDashboardOrganism";

export const metadata: Metadata = {
  title: "Dashboard Eksekutif | Admin Yayasan KBM",
  description:
    "Ikhtisar eksekutif, analitik keuangan, arus kas, dan kinerja program Yayasan Khazanah Berkah Mulia.",
};

interface AdminDashboardPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const { tab } = await searchParams;

  if (tab === "transaksi") redirect("/admin/transaksi");
  if (tab === "program") redirect("/admin/program");
  if (tab === "penyaluran") redirect("/admin/penyaluran");
  if (tab === "pengaturan") redirect("/admin/pengaturan");

  return <AdminDashboardOrganism />;
}
