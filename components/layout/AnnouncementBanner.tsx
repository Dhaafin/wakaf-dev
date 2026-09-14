"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import type { AnnouncementBannerConfig } from "@/types";

const STORAGE_KEY = "kbm_announcement_banner_dismissed";

interface AnnouncementBannerProps {
  /** Digunakan oleh panel Admin untuk menampilkan live preview sebelum disimpan */
  previewConfig?: AnnouncementBannerConfig;
}

export function AnnouncementBanner({ previewConfig }: AnnouncementBannerProps) {
  const [config, setConfig] = useState<AnnouncementBannerConfig | null>(
    previewConfig ?? null,
  );
  const [dismissed, setDismissed] = useState<boolean>(false);

  // Jika tidak ada previewConfig, ambil konfigurasi banner aktif dari API
  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
      return;
    }

    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
      if (isDismissed) {
        setDismissed(true);
      }
    }

    let active = true;
    api
      .getBanner()
      .then((data) => {
        if (active && data) {
          setConfig(data);
        }
      })
      .catch(() => {
        /* fallback bila API gagal */
      });

    return () => {
      active = false;
    };
  }, [previewConfig]);

  // Update realtime jika prop previewConfig berubah di admin
  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
      setDismissed(false);
    }
  }, [previewConfig]);

  if (!config || !config.enabled || (dismissed && !previewConfig)) {
    return null;
  }

  function handleDismiss() {
    if (previewConfig) return; // Jangan dismiss saat di mode live preview admin
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }

  return (
    <aside
      aria-label="Pengumuman Penting"
      className="relative z-30 overflow-hidden bg-gradient-to-r from-brand-950 via-emerald-950 to-brand-950 px-4 py-2.5 text-white shadow-inner border-b border-emerald-500/20"
    >
      {/* Ornamen Kilau Estetik Islami */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-0 h-full w-28 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent blur-md"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-0 h-full w-28 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent blur-md"
      />

      <div className="container-app flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Konten Utama Terhias */}
        <div className="flex flex-1 items-center justify-center gap-2.5 text-center sm:text-left flex-wrap sm:flex-nowrap">
          {/* Badge Ikon Kilau */}
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
            <span className="mr-1">✨</span> Kabar Kebaikan
          </span>

          {/* Teks Pesan Pengumuman */}
          <span className="font-medium text-brand-100 leading-snug">
            {config.text}
          </span>

          {/* Tombol Tautan Aksi (CTA) */}
          {config.linkUrl && config.linkText && (
            <Link
              href={config.linkUrl}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-400 text-brand-950 px-3 py-1 text-xs font-bold transition hover:bg-emerald-300 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            >
              <span>{config.linkText}</span>
            </Link>
          )}
        </div>

        {/* Tombol Tutup (Dismissible) */}
        {!previewConfig && (
          <button
            onClick={handleDismiss}
            aria-label="Tutup pengumuman"
            className="shrink-0 rounded-md p-1 text-brand-300/80 transition hover:bg-white/10 hover:text-white focus:outline-none"
            title="Tutup pengumuman"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
