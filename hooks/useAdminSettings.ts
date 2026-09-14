"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/store/toast";
import type { AnnouncementBannerConfig } from "@/types";

const INITIAL_BANNER_CONFIG: AnnouncementBannerConfig = {
  enabled: true,
  text: "",
  linkText: "",
  linkUrl: "",
};

export function useAdminSettings() {
  const { push } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State Top Announcement Banner
  const [topBanner, setTopBanner] = useState<AnnouncementBannerConfig>(
    INITIAL_BANNER_CONFIG,
  );
  const [initialLoadedBanner, setInitialLoadedBanner] =
    useState<AnnouncementBannerConfig>(INITIAL_BANNER_CONFIG);

  // Fetch settings saat pertama kali render
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const bannerData = await api.getBanner();
      if (bannerData) {
        setTopBanner(bannerData);
        setInitialLoadedBanner(bannerData);
      }
    } catch {
      push({
        kind: "error",
        title: "Gagal Memuat Pengaturan",
        desc: "Terjadi kendala saat mengambil data konfigurasi website.",
      });
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handler update field banner
  const updateBannerField = useCallback(
    <K extends keyof AnnouncementBannerConfig>(
      field: K,
      value: AnnouncementBannerConfig[K],
    ) => {
      setTopBanner((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  // Deteksi apakah ada perubahan yang belum disimpan
  const hasChanges =
    JSON.stringify(topBanner) !== JSON.stringify(initialLoadedBanner);

  // Simpan perubahan ke server
  const handleSave = useCallback(async () => {
    if (!topBanner.text.trim()) {
      push({
        kind: "error",
        title: "Teks Pengumuman Wajib Diisi",
        desc: "Silakan masukkan pesan pengumuman sebelum menyimpan.",
      });
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateBanner(topBanner);
      setTopBanner(updated);
      setInitialLoadedBanner(updated);
      push({
        kind: "success",
        title: "Pengaturan Tersimpan",
        desc: "Konfigurasi website berhasil diperbarui secara langsung.",
      });
    } catch {
      push({
        kind: "error",
        title: "Gagal Menyimpan",
        desc: "Terjadi kesalahan pada server saat memperbarui pengaturan.",
      });
    } finally {
      setSaving(false);
    }
  }, [topBanner, push]);

  // Reset form ke data server terakhir
  const handleReset = useCallback(() => {
    setTopBanner(initialLoadedBanner);
  }, [initialLoadedBanner]);

  return {
    loading,
    saving,
    topBanner,
    hasChanges,
    updateBannerField,
    handleSave,
    handleReset,
    refetch: fetchSettings,
  };
}
