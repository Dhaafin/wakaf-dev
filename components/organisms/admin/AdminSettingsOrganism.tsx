"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { TextInput } from "@/components/molecules/TextInput";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Spinner } from "@/components/atoms/Spinner";

type SettingsTab = "hero" | "banner";

const customEase = [0.16, 1, 0.3, 1] as const;

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
        {/* Header Skeleton */}
        <Skeleton variant="rect" height={132} className="w-full rounded-3xl" />

        {/* 2-Way Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 lg:col-span-3 space-y-3">
            <Skeleton variant="rect" height={160} className="w-full rounded-2xl" />
            <Skeleton variant="rect" height={80} className="w-full rounded-2xl" />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <Skeleton variant="rect" height={480} className="w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. EXECUTIVE HEADER DENGAN AKSEN VISUAL GEOMETRIS */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-8 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="pointer-events-none absolute right-24 -bottom-16 h-48 w-48 rounded-full bg-accent-500/10 blur-xl" />

        {/* Subtle geometric grid background pattern */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '2.5rem 2.5rem' }}
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-700/60 bg-brand-900/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Konfigurasi Portal Publik</span>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Pengaturan Website
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-brand-200/90 leading-relaxed">
              Kelola parameter tampilan beranda, personalisasi narasi hero section, dan kontrol siaran informasi pengumuman portal Yayasan KBM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges || saving}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Batal</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-xs font-bold text-brand-950 shadow-md transition hover:bg-accent-400 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Spinner className="h-4 w-4 text-brand-950" />
                  <span>Menyimpan…</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. 2-WAY LAYOUT: VERTICAL TABS DI KIRI, FORM DI KANAN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: VERTICAL TABS NAVIGATION */}
        <div className="md:col-span-4 lg:col-span-3 space-y-3">
          <div className="card border border-brand-200/80 bg-white p-2 shadow-xs space-y-1">
            {/* Tab 1: Hero Section */}
            <button
              type="button"
              onClick={() => setActiveTab("hero")}
              className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3 select-none ${
                activeTab === "hero"
                  ? "bg-brand-950 text-white shadow-sm"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                activeTab === "hero" ? "bg-white/10 text-emerald-400" : "bg-brand-100/70 text-brand-800"
              }`}>
                {/* Geometric Star / Diamond Icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className={`text-xs font-bold block ${activeTab === "hero" ? "text-white" : "text-brand-950"}`}>
                  Hero Section
                </span>
                <p className={`text-[11px] mt-0.5 truncate ${activeTab === "hero" ? "text-brand-200" : "text-brand-500"}`}>
                  Tajuk utama & tombol aksi
                </p>
              </div>
            </button>

            {/* Tab 2: Top Banner */}
            <button
              type="button"
              onClick={() => setActiveTab("banner")}
              className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3 select-none ${
                activeTab === "banner"
                  ? "bg-brand-950 text-white shadow-sm"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${
                activeTab === "banner" ? "bg-white/10 text-emerald-400" : "bg-brand-100/70 text-brand-800"
              }`}>
                {/* Geometric Broadcast / Flag Icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold ${activeTab === "banner" ? "text-white" : "text-brand-950"}`}>
                    Bar Pengumuman
                  </span>
                  {topBanner.enabled ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" title="Aktif Tayang" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-gray-300 shrink-0" title="Nonaktif" />
                  )}
                </div>
                <p className={`text-[11px] mt-0.5 truncate ${activeTab === "banner" ? "text-brand-200" : "text-brand-500"}`}>
                  Pesan banner & tautan
                </p>
              </div>
            </button>
          </div>

          {/* Info Card / Status Tracker */}
          <div className="card border border-brand-200/80 bg-brand-50/40 p-4 shadow-xs text-xs space-y-2">
            <div className="font-semibold text-brand-900 flex items-center gap-2">
              <svg className="h-3.5 w-3.5 text-brand-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Status Sinkronisasi</span>
            </div>
            <p className="text-[11px] text-brand-600 leading-relaxed">
              {hasChanges ? (
                <span className="text-amber-800 font-medium block">
                  Perubahan formulir belum tersimpan ke server.
                </span>
              ) : (
                <span className="text-emerald-700 font-medium block">
                  Seluruh konfigurasi tersinkronisasi dengan basis data.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: FORM CONTENT PANEL DENGAN FRAMER MOTION ANIMATION */}
        <div className="md:col-span-8 lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === "hero" ? (
              /* TAB CONTENT: HERO SECTION */
              <motion.div
                key="tab-hero"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: customEase }}
                className="card overflow-hidden border border-brand-200/80 bg-white shadow-xs"
              >
                {/* Card Header */}
                <div className="border-b border-brand-100 bg-brand-50/50 p-5 sm:p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-brand-900 text-brand-100">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-brand-950">
                      Hero Section Beranda
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-brand-600">
                    Konfigurasi teks tajuk editorial, kata kunci beraksen zamrud, deskripsi ringkas, dan tombol aksi utama pada puncak beranda portal.
                  </p>
                </div>

                {/* Form Body */}
                <div className="p-5 sm:p-6 space-y-6">
                  {/* 1. Header Typography Inputs */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                      Tipografi & Tajuk Utama
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <TextInput
                        label="Label Penanda (Kicker)"
                        placeholder="Contoh: Inovasi Wakaf Digital"
                        value={hero.badge}
                        onChange={(e) => updateHeroField("badge", e.target.value)}
                        hint="Label kecil di atas judul utama."
                      />
                      <TextInput
                        label="Judul Utama (Baris 1)"
                        required
                        placeholder="Contoh: Kebaikan abadi yang"
                        value={hero.title}
                        onChange={(e) => updateHeroField("title", e.target.value)}
                        hint="Kalimat pembuka tajuk."
                      />
                      <TextInput
                        label="Judul Aksen Zamrud (Baris 2)"
                        placeholder="Contoh: terus mengalir."
                        value={hero.titleHighlight}
                        onChange={(e) => updateHeroField("titleHighlight", e.target.value)}
                        hint="Teks bergaya miring bernuansa zamrud."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-900 mb-1.5">
                        Deskripsi / Subtitle Hero <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={hero.description}
                        onChange={(e) => updateHeroField("description", e.target.value)}
                        placeholder="Contoh: Kendalikan penuh amal jariyah Anda dengan platform terpadu untuk berdonasi, memantau transparansi..."
                        className="w-full rounded-lg border border-brand-200 bg-white p-3 text-xs sm:text-sm text-brand-950 placeholder-brand-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  {/* 2. Call To Action Buttons */}
                  <div className="border-t border-brand-100 pt-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                      Tombol Ajakan Bertindak (Call To Action)
                    </h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Tombol Utama */}
                      <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-brand-900">Tombol Aksi Primer</span>
                        </div>
                        <TextInput
                          label="Teks Tombol Primer"
                          required
                          placeholder="Contoh: Mulai Berwakaf"
                          value={hero.primaryCtaText}
                          onChange={(e) => updateHeroField("primaryCtaText", e.target.value)}
                        />
                        <TextInput
                          label="URL Tujuan Primer"
                          required
                          placeholder="Contoh: /program"
                          value={hero.primaryCtaUrl}
                          onChange={(e) => updateHeroField("primaryCtaUrl", e.target.value)}
                        />
                      </div>

                      {/* Tombol Sekunder */}
                      <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full border border-brand-400 bg-transparent" />
                            <span className="text-xs font-bold text-brand-900">Tombol Aksi Sekunder</span>
                          </div>
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                            <span className="text-[11px] font-semibold text-brand-700">
                              {hero.showSecondaryCta ? "Aktif" : "Nonaktif"}
                            </span>
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
                              className={`dot absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                                hero.showSecondaryCta ? "translate-x-4" : ""
                              }`}
                            />
                          </label>
                        </div>
                        <TextInput
                          label="Teks Tombol Sekunder"
                          placeholder="Contoh: Kalkulator Zakat"
                          value={hero.secondaryCtaText ?? ""}
                          disabled={!hero.showSecondaryCta}
                          onChange={(e) => updateHeroField("secondaryCtaText", e.target.value)}
                        />
                        <TextInput
                          label="URL Tujuan Sekunder"
                          placeholder="Contoh: /zakat"
                          value={hero.secondaryCtaUrl ?? ""}
                          disabled={!hero.showSecondaryCta}
                          onChange={(e) => updateHeroField("secondaryCtaUrl", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-brand-100 bg-brand-50/40 p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="text-xs text-brand-500">
                    {hasChanges ? (
                      <span className="text-amber-700 font-medium">
                        Terdapat perubahan yang belum disimpan.
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">
                        Pengaturan tersinkron dengan server.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={!hasChanges || saving}
                      className="btn-outline px-4 py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={!hasChanges || saving}
                      className="btn-primary px-5 py-2 text-xs font-semibold flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Spinner className="h-3.5 w-3.5 text-white" />
                          <span>Menyimpan…</span>
                        </>
                      ) : (
                        <span>Simpan Pengaturan</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* TAB CONTENT: TOP ANNOUNCEMENT BANNER */
              <motion.div
                key="tab-banner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: customEase }}
                className="card overflow-hidden border border-brand-200/80 bg-white shadow-xs"
              >
                {/* Card Header with Status Toggle */}
                <div className="border-b border-brand-100 bg-brand-50/50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-brand-900 text-brand-100">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-serif text-base sm:text-lg font-bold text-brand-950">
                        Bar Pengumuman Global (Top Announcement Banner)
                      </h2>
                      <p className="mt-0.5 text-xs text-brand-600">
                        Pesan pengumuman penting bernuansa zamrud yang tampil melekat di atas menu navigasi seluruh situs publik.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch Aktif/Nonaktif */}
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                    <span className="text-xs font-semibold text-brand-900">
                      {topBanner.enabled ? "Status: Aktif Tayang" : "Status: Dinonaktifkan"}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={topBanner.enabled}
                        onChange={(e) => updateBannerField("enabled", e.target.checked)}
                      />
                      <div
                        className={`block h-6 w-11 rounded-full transition-colors ${
                          topBanner.enabled ? "bg-emerald-600" : "bg-brand-200"
                        }`}
                      />
                      <div
                        className={`dot absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          topBanner.enabled ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>

                {/* Form Body */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Teks Pesan Pengumuman */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-900 mb-1.5">
                      Pesan Pengumuman <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={topBanner.text}
                      onChange={(e) => updateBannerField("text", e.target.value)}
                      placeholder="Contoh: Salurkan wakaf dan sedekah terbaik Anda bersama Yayasan KBM"
                      className="w-full rounded-lg border border-brand-200 bg-white p-3 text-xs sm:text-sm text-brand-950 placeholder-brand-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Teks Tombol Aksi (CTA) */}
                    <TextInput
                      label="Teks Tombol Aksi (CTA)"
                      placeholder="Contoh: Tunaikan Sekarang →"
                      value={topBanner.linkText ?? ""}
                      onChange={(e) => updateBannerField("linkText", e.target.value)}
                      hint="Kosongkan apabila banner hanya menyajikan informasi teks statis."
                    />

                    {/* URL Tautan Tujuan */}
                    <TextInput
                      label="Tautan URL Tujuan"
                      placeholder="Contoh: /program atau /program/prg_xxxx"
                      value={topBanner.linkUrl ?? ""}
                      onChange={(e) => updateBannerField("linkUrl", e.target.value)}
                      hint="Dapat berupa rute internal (/program) atau tautan eksternal."
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-brand-100 bg-brand-50/40 p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="text-xs text-brand-500">
                    {hasChanges ? (
                      <span className="text-amber-700 font-medium">
                        Terdapat perubahan yang belum disimpan.
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">
                        Pengaturan tersinkron dengan server.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={!hasChanges || saving}
                      className="btn-outline px-4 py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={!hasChanges || saving}
                      className="btn-primary px-5 py-2 text-xs font-semibold flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Spinner className="h-3.5 w-3.5 text-white" />
                          <span>Menyimpan…</span>
                        </>
                      ) : (
                        <span>Simpan Pengaturan</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
