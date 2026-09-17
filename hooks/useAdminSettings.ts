"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/store/toast";
import type { AnnouncementBannerConfig, HeroSectionConfig, PaymentConfig } from "@/types";

const INITIAL_BANNER_CONFIG: AnnouncementBannerConfig = {
  enabled: true,
  text: "",
  linkText: "",
  linkUrl: "",
};

const INITIAL_HERO_CONFIG: HeroSectionConfig = {
  badge: "Inovasi Wakaf Digital",
  title: "Kebaikan abadi yang",
  titleHighlight: "terus mengalir.",
  description:
    "Kendalikan penuh amal jariyah Anda dengan platform terpadu untuk berdonasi, memantau transparansi, dan melihat perkembangan wakaf secara nyata.",
  primaryCtaText: "Mulai Berwakaf",
  primaryCtaUrl: "/program",
  secondaryCtaText: "Kalkulator Zakat",
  secondaryCtaUrl: "/zakat",
  showSecondaryCta: true,
};

const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  expiryDuration: 24,
  expiryUnit: "hours",
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

  // Form State Hero Section
  const [hero, setHero] = useState<HeroSectionConfig>(INITIAL_HERO_CONFIG);
  const [initialLoadedHero, setInitialLoadedHero] =
    useState<HeroSectionConfig>(INITIAL_HERO_CONFIG);

  // Form State Payment Config
  const [payment, setPayment] = useState<PaymentConfig>(INITIAL_PAYMENT_CONFIG);
  const [initialLoadedPayment, setInitialLoadedPayment] =
    useState<PaymentConfig>(INITIAL_PAYMENT_CONFIG);

  // Fetch settings saat pertama kali render
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await api.getSettings();
      if (settings) {
        if (settings.topBanner) {
          setTopBanner(settings.topBanner);
          setInitialLoadedBanner(settings.topBanner);
        }
        if (settings.hero) {
          setHero(settings.hero);
          setInitialLoadedHero(settings.hero);
        }
        if (settings.payment) {
          setPayment(settings.payment);
          setInitialLoadedPayment(settings.payment);
        }
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

  // Handler update field hero section
  const updateHeroField = useCallback(
    <K extends keyof HeroSectionConfig>(
      field: K,
      value: HeroSectionConfig[K],
    ) => {
      setHero((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  // Handler update field payment config
  const updatePaymentField = useCallback(
    <K extends keyof PaymentConfig>(
      field: K,
      value: PaymentConfig[K],
    ) => {
      setPayment((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  // Deteksi apakah ada perubahan yang belum disimpan
  const hasChanges =
    JSON.stringify(topBanner) !== JSON.stringify(initialLoadedBanner) ||
    JSON.stringify(hero) !== JSON.stringify(initialLoadedHero) ||
    JSON.stringify(payment) !== JSON.stringify(initialLoadedPayment);

  // Simpan perubahan ke server
  const handleSave = useCallback(async () => {
    if (topBanner.enabled && !topBanner.text.trim()) {
      push({
        kind: "error",
        title: "Teks Pengumuman Wajib Diisi",
        desc: "Silakan masukkan pesan pengumuman sebelum mengaktifkan banner.",
      });
      return;
    }

    if (!hero.title.trim() || !hero.primaryCtaText.trim() || !hero.primaryCtaUrl.trim()) {
      push({
        kind: "error",
        title: "Bidang Hero Section Belum Lengkap",
        desc: "Judul hero, teks tombol utama, dan URL tombol utama wajib diisi.",
      });
      return;
    }

    if (payment.expiryDuration <= 0) {
      push({
        kind: "error",
        title: "Durasi Tidak Valid",
        desc: "Durasi kedaluwarsa pembayaran harus lebih dari 0.",
      });
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateSettings({
        topBanner,
        hero,
        payment,
      });

      if (updated.topBanner) {
        setTopBanner(updated.topBanner);
        setInitialLoadedBanner(updated.topBanner);
      }
      if (updated.hero) {
        setHero(updated.hero);
        setInitialLoadedHero(updated.hero);
      }
      if (updated.payment) {
        setPayment(updated.payment);
        setInitialLoadedPayment(updated.payment);
      }

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
  }, [topBanner, hero, payment, push]);

  // Reset form ke data server terakhir
  const handleReset = useCallback(() => {
    setTopBanner(initialLoadedBanner);
    setHero(initialLoadedHero);
    setPayment(initialLoadedPayment);
  }, [initialLoadedBanner, initialLoadedHero, initialLoadedPayment]);

  return {
    loading,
    saving,
    topBanner,
    hero,
    payment,
    hasChanges,
    updateBannerField,
    updateHeroField,
    updatePaymentField,
    handleSave,
    handleReset,
    refetch: fetchSettings,
  };
}
