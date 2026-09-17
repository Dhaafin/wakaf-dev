"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { TextInput } from "@/components/molecules/TextInput";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Spinner } from "@/components/atoms/Spinner";

import { AdminPageHeader } from "@/components/molecules/AdminPageHeader";
import { SelectDropdown, type SelectOption } from "@/components/molecules/SelectDropdown";

type SettingsTab = "hero" | "banner" | "payment";

const SETTINGS_TABS: {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "hero",
    label: "Hero Section",
    icon: (
      <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "banner",
    label: "Bar Pengumuman",
    icon: (
      <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    id: "payment",
    label: "Pembayaran",
    icon: (
      <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

const EXPIRY_UNIT_OPTIONS: readonly SelectOption<"minutes" | "hours" | "days">[] = [
  { value: "minutes", label: "Menit" },
  { value: "hours", label: "Jam" },
  { value: "days", label: "Hari" },
];

export function AdminSettingsOrganism() {
  const {
    loading,
    saving,
    topBanner,
    hero,
    hasChanges,
    updateBannerField,
    updateHeroField,
    payment,
    updatePaymentField,
    handleSave,
    handleReset,
  } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>("hero");

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. REUSABLE EXECUTIVE HEADER */}
      <AdminPageHeader
        title="Pengaturan Website"
        description="Kelola konten hero section landing page dan bar pengumuman publik secara terpusat."
        refreshing={loading}
      />

      {/* 2. 2-WAY LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: TABS WITH GROWING UNDERLINE */}
        <div className="md:col-span-4 lg:col-span-3">
          {loading ? (
            <Skeleton variant="rect" height={120} className="w-full rounded-xl" />
          ) : (
            <div className="card rounded-xl border border-brand-200/80 bg-white p-2 shadow-xs flex flex-row md:flex-col gap-1 overflow-x-auto">
              {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative px-3.5 py-3 rounded-lg text-left transition-colors flex items-center justify-between gap-3 select-none flex-1 md:flex-initial cursor-pointer ${
                      isActive
                        ? "text-brand-950 font-bold bg-brand-50/70"
                        : "text-brand-600 hover:text-brand-900 hover:bg-brand-50/30 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {tab.icon}
                      <span className="text-xs truncate">{tab.label}</span>
                    </div>

                    {tab.id === "banner" && (
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          topBanner.enabled ? "bg-emerald-500" : "bg-brand-300"
                        }`}
                      />
                    )}

                    {/* Underline: grows on hover when inactive, stays full when active */}
                    <span
                      className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300 ease-out origin-left pointer-events-none ${
                        isActive
                          ? "bg-emerald-600 scale-x-100 opacity-100"
                          : "bg-emerald-600 scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* KOLOM KANAN: FORM CONTENT */}
        <div className="md:col-span-8 lg:col-span-9">
          {loading ? (
            <Skeleton variant="rect" height={400} className="w-full rounded-xl" />
          ) : (
            <AnimatePresence mode="wait">
            {activeTab === "hero" && (
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
            )}

            {activeTab === "banner" && (
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

            {activeTab === "payment" && (
              <motion.div
                key="tab-payment"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="card rounded-xl overflow-hidden border border-brand-200/80 bg-white shadow-xs"
              >
                <div className="border-b border-brand-100 bg-brand-50/40 px-5 py-4">
                  <h2 className="font-serif text-base font-bold text-brand-950">
                    Pengaturan Pembayaran
                  </h2>
                </div>

                <div className="p-5 space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-brand-900 mb-1">
                      Batas Kedaluwarsa Transaksi (Midtrans)
                    </h3>
                    <p className="text-xs text-brand-500 mb-4">
                      Tentukan berapa lama tautan pembayaran Virtual Account/QRIS akan aktif sebelum dibatalkan otomatis oleh sistem.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 max-w-md">
                      <TextInput
                        label="Durasi"
                        required
                        type="number"
                        min={1}
                        value={payment.expiryDuration}
                        onChange={(e) =>
                          updatePaymentField(
                            "expiryDuration",
                            parseInt(e.target.value) || 1,
                          )
                        }
                      />
                      <SelectDropdown<"minutes" | "hours" | "days">
                        label="Satuan Waktu"
                        required
                        value={payment.expiryUnit}
                        onChange={(val) => updatePaymentField("expiryUnit", val)}
                        options={EXPIRY_UNIT_OPTIONS}
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
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
