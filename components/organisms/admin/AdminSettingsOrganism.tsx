"use client";

import { useAdminSettings } from "@/hooks/useAdminSettings";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { TextInput } from "@/components/molecules/TextInput";
import { Spinner } from "@/components/atoms/Spinner";

export function AdminSettingsOrganism() {
  const {
    loading,
    saving,
    topBanner,
    hasChanges,
    updateBannerField,
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
      <div className="flex flex-col gap-1 border-b border-brand-100 pb-5">
        <h1 className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
          Pengaturan Website
        </h1>
        <p className="text-xs sm:text-sm text-brand-600">
          Kelola konfigurasi umum, bar pengumuman informasi penting, dan visibilitas elemen publik Yayasan KBM.
        </p>
      </div>

      {/* SECTION 1: TOP ANNOUNCEMENT BANNER */}
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
