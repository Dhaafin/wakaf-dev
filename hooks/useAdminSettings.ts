"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/store/toast";
import type { AnnouncementBannerConfig, HeroSectionConfig, PaymentConfig, TutorialSectionConfig, TutorialStep } from "@/types";

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

const INITIAL_TUTORIAL_CONFIG: TutorialSectionConfig = {
  title: "Empat langkah, selesai",
  subtitle: "Berwakaf dan berdonasi kini lebih mudah, cepat, dan transparan.",
  steps: [
    {
      stepNumber: "01",
      title: "Pilih jenis & program",
      description: "Wakaf uang, wakaf melalui uang, infaq & shadaqah, atau zakat.",
      icon: "search",
      imageUrl: "/images/tutorial/step-1.jpg",
    },
    {
      stepNumber: "02",
      title: "Isi & konfirmasi",
      description: "Nominal, atas nama sendiri/orang lain, publik atau anonim.",
      icon: "edit",
      imageUrl: "/images/tutorial/step-2.jpg",
    },
    {
      stepNumber: "03",
      title: "Bayar via Virtual Account",
      description: "Nomor VA terbit otomatis. Bayar sebelum waktu habis.",
      icon: "payment",
      imageUrl: "/images/tutorial/step-3.jpg",
    },
    {
      stepNumber: "04",
      title: "Terima bukti resmi",
      description: "Sertifikat wakaf / bukti donasi / bukti setor zakat, bernomor unik & bisa diverifikasi.",
      icon: "check",
      imageUrl: "/images/tutorial/step-4.jpg",
    },
  ],
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

  // Form State Tutorial Section
  const [tutorial, setTutorial] =
    useState<TutorialSectionConfig>(INITIAL_TUTORIAL_CONFIG);
  const [initialLoadedTutorial, setInitialLoadedTutorial] =
    useState<TutorialSectionConfig>(INITIAL_TUTORIAL_CONFIG);

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
        if (settings.tutorial) {
          setTutorial(settings.tutorial);
          setInitialLoadedTutorial(settings.tutorial);
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

  // Handler update field tutorial section
  const updateTutorialField = useCallback(
    <K extends keyof TutorialSectionConfig>(
      field: K,
      value: TutorialSectionConfig[K],
    ) => {
      setTutorial((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  // Handler update step item tutorial
  const updateTutorialStep = useCallback(
    (index: number, field: keyof TutorialStep, value: string) => {
      setTutorial((prev) => {
        const nextSteps = [...prev.steps];
        if (nextSteps[index]) {
          nextSteps[index] = {
            ...nextSteps[index],
            [field]: value,
          };
        }
        return {
          ...prev,
          steps: nextSteps,
        };
      });
    },
    [],
  );

  // Deteksi apakah ada perubahan yang belum disimpan
  const hasChanges =
    JSON.stringify(topBanner) !== JSON.stringify(initialLoadedBanner) ||
    JSON.stringify(hero) !== JSON.stringify(initialLoadedHero) ||
    JSON.stringify(payment) !== JSON.stringify(initialLoadedPayment) ||
    JSON.stringify(tutorial) !== JSON.stringify(initialLoadedTutorial);

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

    if (!tutorial.title.trim() || !Array.isArray(tutorial.steps) || tutorial.steps.length === 0) {
      push({
        kind: "error",
        title: "Panduan Langkah Belum Lengkap",
        desc: "Judul panduan langkah dan minimal satu langkah wajib diisi.",
      });
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateSettings({
        topBanner,
        hero,
        payment,
        tutorial,
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
      if (updated.tutorial) {
        setTutorial(updated.tutorial);
        setInitialLoadedTutorial(updated.tutorial);
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
  }, [topBanner, hero, payment, tutorial, push]);

  // Reset form ke data server terakhir
  const handleReset = useCallback(() => {
    setTopBanner(initialLoadedBanner);
    setHero(initialLoadedHero);
    setPayment(initialLoadedPayment);
    setTutorial(initialLoadedTutorial);
  }, [initialLoadedBanner, initialLoadedHero, initialLoadedPayment, initialLoadedTutorial]);

  return {
    loading,
    saving,
    topBanner,
    hero,
    payment,
    tutorial,
    hasChanges,
    updateBannerField,
    updateHeroField,
    updatePaymentField,
    updateTutorialField,
    updateTutorialStep,
    handleSave,
    handleReset,
    refetch: fetchSettings,
  };
}
