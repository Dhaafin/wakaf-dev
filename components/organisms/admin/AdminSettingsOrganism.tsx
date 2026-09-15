"use client";

import { useAdminSettings } from "@/hooks/useAdminSettings";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { HeroSection } from "@/components/organisms/landingPage/molecules/HeroSection";
import { TextInput } from "@/components/molecules/TextInput";
import { Spinner } from "@/components/atoms/Spinner";

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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto h-8 w-8 text-brand-600" />
          <p className="mt-3 text-xs font-medium text-brand-600">
            Memuat konfigurasi website…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-100 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
            Pengaturan Website
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 mt-1">
            Kelola konfigurasi umum, bar pengumuman informasi penting, dan kustomisasi tampilan Hero Section Beranda.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2.5 shrink-0">
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

      {/* SECTION 1: HERO SECTION BERANDA */}
      <div className="card overflow-hidden border border-brand-200/80 bg-white shadow-xs">
        {/* Section Header */}
        <div className="border-b border-brand-100 bg-brand-50/50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-brand-950">
                Hero Section Beranda (Landing Page Hero)
              </h2>
            </div>
            <p className="mt-1 text-xs text-brand-600">
              Kustomisasi tajuk utama, teks berjalan/aksen, deskripsi, dan tombol ajakan bertindak (CTA) pada bagian paling atas halaman depan.
            </p>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-5 sm:p-6 border-b border-brand-100 bg-brand-950/[0.02]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
              <span>👁️</span> Pratinjau Langsung Hero (Live Preview Pengunjung)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Tampilan Realtime
            </span>
          </div>

          <div className="rounded-lg overflow-hidden border border-brand-800 shadow-sm">
            <HeroSection previewConfig={hero} isCompactPreview={true} />
          </div>
        </div>

        {/* Form Inputs Hero Section */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Badge Label & Judul Baris 1 */}
          <div className="grid gap-5 sm:grid-cols-3">
            <TextInput
              label="Label Badge / Kicker"
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
              hint="Teks kalimat awal tajuk."
            />
            <TextInput
              label="Judul Aksen Zamrud (Baris 2)"
              placeholder="Contoh: terus mengalir."
              value={hero.titleHighlight}
              onChange={(e) => updateHeroField("titleHighlight", e.target.value)}
              hint="Ditampilkan miring dengan warna hijau zamrud berkilau."
            />
          </div>

          {/* Deskripsi Hero */}
          <div>
            <label className="block text-xs font-semibold text-brand-900 mb-1.5">
              Deskripsi / Subtitle Hero <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={hero.description}
              onChange={(e) => updateHeroField("description", e.target.value)}
              placeholder="Contoh: Kendalikan penuh amal jariyah Anda dengan platform terpadu untuk berdonasi..."
              className="w-full rounded-lg border border-brand-200 bg-white p-3 text-xs sm:text-sm text-brand-950 placeholder-brand-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Tombol CTA Utama & Sekunder */}
          <div className="border-t border-brand-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 mb-4">
              Konfigurasi Tombol Aksi (Call To Action Buttons)
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Tombol Utama (Primary CTA) */}
              <div className="rounded-lg border border-brand-200 bg-brand-50/30 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-brand-900">Tombol Utama (Emerald Solid)</span>
                </div>
                <TextInput
                  label="Teks Tombol Utama"
                  required
                  placeholder="Contoh: Mulai Berwakaf"
                  value={hero.primaryCtaText}
                  onChange={(e) => updateHeroField("primaryCtaText", e.target.value)}
                />
                <TextInput
                  label="URL Tujuan Tombol Utama"
                  required
                  placeholder="Contoh: /program"
                  value={hero.primaryCtaUrl}
                  onChange={(e) => updateHeroField("primaryCtaUrl", e.target.value)}
                />
              </div>

              {/* Tombol Sekunder (Secondary CTA) */}
              <div className="rounded-lg border border-brand-200 bg-brand-50/30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border border-brand-400 bg-transparent" />
                    <span className="text-xs font-bold text-brand-900">Tombol Sekunder (Outline)</span>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[11px] font-semibold text-brand-700">
                      {hero.showSecondaryCta ? "Tampilkan" : "Sembunyikan"}
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
                  label="URL Tujuan Tombol Sekunder"
                  placeholder="Contoh: /zakat"
                  value={hero.secondaryCtaUrl ?? ""}
                  disabled={!hero.showSecondaryCta}
                  onChange={(e) => updateHeroField("secondaryCtaUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TOP ANNOUNCEMENT BANNER */}
      <div className="card overflow-hidden border border-brand-200/80 bg-white shadow-xs">
        {/* Section Header */}
        <div className="border-b border-brand-100 bg-brand-50/50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📢</span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-brand-950">
                Bar Pengumuman Atas (Top Announcement Banner)
              </h2>
            </div>
            <p className="mt-1 text-xs text-brand-600">
              Banner terhias bernuansa zamrud KBM yang tampil menempel di atas menu navigasi seluruh situs publik.
            </p>
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

        {/* Live Preview Box */}
        <div className="p-5 sm:p-6 border-b border-brand-100 bg-brand-950/[0.02]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
              <span>👁️</span> Pratinjau Langsung (Live Preview Pengunjung)
            </span>
            {topBanner.enabled ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Akan Muncul di Situs
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                Disembunyikan (Nonaktif)
              </span>
            )}
          </div>

          <div className="rounded-lg overflow-hidden border border-brand-200 bg-white shadow-xs">
            {topBanner.enabled ? (
              <AnnouncementBanner previewConfig={topBanner} />
            ) : (
              <div className="p-4 text-center text-xs text-brand-400 italic bg-brand-50/30">
                Banner saat ini sedang dinonaktifkan dan tidak akan ditampilkan kepada pengunjung.
              </div>
            )}
          </div>
        </div>

        {/* Form Inputs */}
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
              placeholder="Contoh: 🌙 Raih keberkahan jariyah: Salurkan wakaf dan sedekah terbaik Anda bersama Yayasan KBM"
              className="w-full rounded-lg border border-brand-200 bg-white p-3 text-xs sm:text-sm text-brand-950 placeholder-brand-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <p className="mt-1 text-[11px] text-brand-500">
              Saran: Gunakan emoji yang relevan (✨, 🌙, 📢) di awal teks agar tampilan banner semakin menarik perhatian pengunjung.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Teks Tombol Aksi (CTA) */}
            <TextInput
              label="Teks Tombol Aksi (CTA)"
              placeholder="Contoh: Tunaikan Sekarang →"
              value={topBanner.linkText ?? ""}
              onChange={(e) => updateBannerField("linkText", e.target.value)}
              hint="Biarkan kosong jika banner hanya berupa teks informasi tanpa tombol tautan."
            />

            {/* URL Tautan Tujuan */}
            <TextInput
              label="Tautan URL Tujuan"
              placeholder="Contoh: /program atau /program/prg_xxxx"
              value={topBanner.linkUrl ?? ""}
              onChange={(e) => updateBannerField("linkUrl", e.target.value)}
              hint="Dapat berupa rute internal (/program) atau URL eksternal lengkap."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-brand-100 bg-brand-50/40 p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="text-xs text-brand-500">
            {hasChanges ? (
              <span className="text-amber-700 font-medium">
                ● Terdapat perubahan yang belum disimpan
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                ✓ Pengaturan tersinkron dengan server
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
      </div>
    </div>
  );
}
