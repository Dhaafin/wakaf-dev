import { formatTanggalWaktu } from "@/lib/format";
import { AdminPageHeader } from "@/components/molecules/AdminPageHeader";

export interface AdminDashboardHeaderProps {
  lastUpdated: Date | string;
  loading: boolean;
  onRefresh: () => void;
}

export function AdminDashboardHeader({
  lastUpdated,
  loading,
  onRefresh,
}: AdminDashboardHeaderProps) {
  return (
    <AdminPageHeader
      badge="Pusat Kendali & Akuntabilitas Yayasan KBM"
      title="Ikhtisar Eksekutif & Kinerja Wakaf"
      description="Pantau arus dana masuk umat, rasio realisasi penyaluran amanah, tren keuangan berkala, serta efektivitas konversi donasi secara transparan dan akuntabel."
      onRefresh={onRefresh}
      refreshing={loading}
      refreshLabel="Segarkan"
      subtitleExtra={
        <div className="text-left sm:text-right text-[11px] text-brand-300">
          <p className="font-medium text-brand-200">Pembaruan Terkini</p>
          <p className="font-mono text-white/80">
            {formatTanggalWaktu(
              typeof lastUpdated === "string"
                ? lastUpdated
                : lastUpdated.toISOString(),
            )}
          </p>
        </div>
      }
    />
  );
}

