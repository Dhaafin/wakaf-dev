import type { Metadata } from "next";
import { AdminSettingsOrganism } from "@/components/organisms/admin/AdminSettingsOrganism";

export const metadata: Metadata = {
  title: "Pengaturan Website | Admin Yayasan KBM",
  description: "Kelola konfigurasi website, bar pengumuman, dan tampilan publik Yayasan Khazanah Berkah Mulia.",
};

export default function AdminPengaturanPage() {
  return <AdminSettingsOrganism />;
}
