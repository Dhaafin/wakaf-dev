"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { TextInput } from "@/components/molecules/TextInput";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Spinner } from "@/components/atoms/Spinner";

import { AdminPageHeader } from "@/components/molecules/AdminPageHeader";

type SettingsTab = "hero" | "banner";

export function AdminSettingsOrganism() {
  const {
    loading,
    saving,
    topBanner,
    hero,
    hasChanges,
    updateBannerField,
    updateHeroField,
    handleSave,
    handleReset,
  } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>("hero");

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        <Skeleton variant="rect" height={140} className="w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 lg:col-span-3">
            <Skeleton variant="rect" height={120} className="w-full rounded-xl" />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <Skeleton variant="rect" height={400} className="w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. REUSABLE EXECUTIVE HEADER */}
      <AdminPageHeader
        title="Pengaturan Website"
        description="Kelola konten hero section landing page dan bar pengumuman publik secara terpusat."
      />

      {/* 2. 2-WAY LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: TABS WITH GROWING UNDERLINE */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="card rounded-xl border border-brand-200/80 bg-white p-2 shadow-xs flex flex-row md:flex-col gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("hero")}
              className={`relative px-3.5 py-3 rounded-lg text-left transition-colors flex items-center justify-between gap-3 select-none flex-1 md:flex-initial cursor-pointer ${
                activeTab === "hero"
                  ? "text-brand-950 font-bold bg-brand-50/70"
                  : "text-brand-600 hover:text-brand-900 hover:bg-brand-50/30 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-xs truncate">Hero Section</span>
              </div>

              {activeTab === "hero" && (
                <motion.div
                  layoutId="activeSettingsTabUnderline"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("banner")}
              className={`relative px-3.5 py-3 rounded-lg text-left transition-colors flex items-center justify-between gap-3 select-none flex-1 md:flex-initial cursor-pointer ${
                activeTab === "banner"
                  ? "text-brand-950 font-bold bg-brand-50/70"
                  : "text-brand-600 hover:text-brand-900 hover:bg-brand-50/30 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <span className="text-xs truncate">Bar Pengumuman</span>
              </div>

              <span
                className={`h-2 w-2 rounded-full shrink-0 ${
                  topBanner.enabled ? "bg-emerald-500" : "bg-brand-300"
                }`}
              />

              {activeTab === "banner" && (
                <motion.div
                  layoutId="activeSettingsTabUnderline"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: FORM CONTENT */}
        <div className="md:col-span-8 lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === "hero" ? (
              <motion.div
                key="tab-hero"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="card rounded-xl overflow-hidden border border-brand-200/80 bg-white shadow-xs"
              >
                <div className="border-b border-brand-100 bg-brand-50/40 px-5 py-4">
                  <h2 className="font-serif text-base font-bold text-brand-950">
                    Hero Section Beranda
                  </h2>
                </div>

                <div className="p-5 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <TextInput
                      label="Badge / Kicker"
                      placeholder="Inovasi Wakaf Digital"
                      value={hero.badge}
                      onChange={(e) => updateHeroField("badge", e.target.value)}
                    />
                    <TextInput
                      label="Judul Baris 1"
                      required
                      placeholder="Kebaikan abadi yang"
                      value={hero.title}
                      onChange={(e) => updateHeroField("title", e.target.value)}
                    />
                    <TextInput
                      label="Judul Aksen (Baris 2)"
                      placeholder="terus mengalir."
                      value={hero.titleHighlight}
                      onChange={(e) => updateHeroField("titleHighlight", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-900 mb-1.5">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={hero.description}
                      onChange={(e) => updateHeroField("description", e.target.value)}
                      placeholder="Deskripsi ringkas hero section..."
                      className="w-full rounded-lg border border-brand-200 bg-white p-3 text-xs sm:text-sm text-brand-950 placeholder-brand-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    {/* Primary Button */}
                    <div className="rounded-lg border border-brand-200 bg-brand-50/20 p-4 space-y-3">
                      <div className="text-xs font-bold text-brand-900">Tombol Utama</div>
                      <TextInput
                        label="Teks"
                        required
                        placeholder="Mulai Berwakaf"
                        value={hero.primaryCtaText}
                        onChange={(e) => updateHeroField("primaryCtaText", e.target.value)}
                      />
                      <TextInput
                        label="URL Tujuan"
                        required
                        placeholder="/program"
                        value={hero.primaryCtaUrl}
                        onChange={(e) => updateHeroField("primaryCtaUrl", e.target.value)}
                      />
                    </div>

                    {/* Secondary Button */}
                    <div className="rounded-lg border border-brand-200 bg-brand-50/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-900">Tombol Sekunder</span>
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <span className="text-[11px] font-medium text-brand-600">
                            {hero.showSecondaryCta ? "Aktif" : "Nonaktif"}
                          </span>
                          <div className="relative inline-block h-5 w-9">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={hero.showSecondaryCta ?? true}
                              onChange={(e) => updateHeroField("showSecondaryCta", e.target.checked)}
                            />
                            <div
                              className={`block h-5 w-9 rounded-full transition-colors ${
                                hero.showSecondaryCta ? "bg-emerald-600" : "bg-brand-200"
                              }`}
                            />
                            <div
                              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
                                hero.showSecondaryCta ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                      <TextInput
                        label="Teks"
                        placeholder="Kalkulator Zakat"
                        value={hero.secondaryCtaText ?? ""}
                        disabled={!hero.showSecondaryCta}
                        onChange={(e) => updateHeroField("secondaryCtaText", e.target.value)}
                      />
                      <TextInput
                        label="URL Tujuan"
                        placeholder="/zakat"
                        value={hero.secondaryCtaUrl ?? ""}
                        disabled={!hero.showSecondaryCta}
                        onChange={(e) => updateHeroField("secondaryCtaUrl", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-brand-100 bg-brand-50/40 p-4 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={!hasChanges || saving}
                    className="btn-outline px-4 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="btn-primary px-5 py-1.5 text-xs font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Spinner className="h-3.5 w-3.5 text-white" />
                        <span>Menyimpan…</span>
                      </>
                    ) : (
                      <span>Simpan</span>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tab-banner"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="card rounded-xl overflow-hidden border border-brand-200/80 bg-white shadow-xs"
              >
                <div className="border-b border-brand-100 bg-brand-50/40 px-5 py-4 flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-brand-950">
                    Bar Pengumuman Atas
                  </h2>

                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <span className="text-xs font-medium text-brand-700">
                      {topBanner.enabled ? "Aktif" : "Nonaktif"}
                    </span>
                    <div className="relative inline-block h-5 w-9">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={topBanner.enabled}
                        onChange={(e) => updateBannerField("enabled", e.target.checked)}
                      />
                      <div
                        className={`block h-5 w-9 rounded-full transition-colors ${
                          topBanner.enabled ? "bg-emerald-600" : "bg-brand-200"
                        }`}
                      />
                      <div
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
                          topBanner.enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </label>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-900 mb-1.5">
                      Pesan Pengumuman <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={topBanner.text}
                      onChange={(e) => updateBannerField("text", e.target.value)}
                      placeholder="Masukkan teks banner pengumuman..."
                      className="w-full rounded-lg border border-brand-200 bg-white p-3 text-xs sm:text-sm text-brand-950 placeholder-brand-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      label="Teks Tombol Aksi"
                      placeholder="Tunaikan Sekarang →"
                      value={topBanner.linkText ?? ""}
                      onChange={(e) => updateBannerField("linkText", e.target.value)}
                    />
                    <TextInput
                      label="URL Tautan Tujuan"
                      placeholder="/program"
                      value={topBanner.linkUrl ?? ""}
                      onChange={(e) => updateBannerField("linkUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-brand-100 bg-brand-50/40 p-4 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={!hasChanges || saving}
                    className="btn-outline px-4 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="btn-primary px-5 py-1.5 text-xs font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Spinner className="h-3.5 w-3.5 text-white" />
                        <span>Menyimpan…</span>
                      </>
                    ) : (
                      <span>Simpan</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
