"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api/client";
import type { AnnouncementBannerConfig } from "@/types";

const STORAGE_KEY = "kbm_announcement_banner_dismissed_text";

interface AnnouncementBannerProps {
  /** Digunakan oleh panel Admin untuk menampilkan live preview sebelum disimpan */
  previewConfig?: AnnouncementBannerConfig;
}

export function AnnouncementBanner({ previewConfig }: AnnouncementBannerProps) {
  const pathname = usePathname();
  const [config, setConfig] = useState<AnnouncementBannerConfig | null>(
    previewConfig ?? null,
  );
  const [dismissed, setDismissed] = useState<boolean>(false);

  // Jika tidak ada previewConfig, ambil konfigurasi banner aktif dari API (kecuali di admin panel)
  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
      return;
    }

    if (pathname?.startsWith("/admin")) {
      return;
    }

    if (typeof window !== "undefined") {
      // Bersihkan key sesi lama jika ada
      sessionStorage.removeItem("kbm_announcement_banner_dismissed");
    }

    let active = true;
    api
      .getBanner()
      .then((data) => {
        if (!active || !data) return;
        setConfig(data);
        if (typeof window !== "undefined") {
          const dismissedText = localStorage.getItem(STORAGE_KEY);
          // Jika teks pengumuman yang pernah ditutup sama dengan teks aktif, sembunyikan.
          // Jika pengumuman diubah oleh admin, banner otomatis muncul kembali.
          setDismissed(Boolean(dismissedText && dismissedText === data.text));
        }
      })
      .catch(() => {
        /* fallback bila API gagal */
      });

    return () => {
      active = false;
    };
  }, [previewConfig, pathname]);

  // Update realtime jika prop previewConfig berubah di admin
  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
      setDismissed(false);
    }
  }, [previewConfig]);

  // Sembunyikan banner di semua rute admin panel kecuali untuk live preview
  if (pathname?.startsWith("/admin") && !previewConfig) {
    return null;
  }

  function handleDismiss() {
    if (previewConfig) return; // Jangan dismiss saat di mode live preview admin
    setDismissed(true);
    if (typeof window !== "undefined" && config?.text) {
      localStorage.setItem(STORAGE_KEY, config.text);
    }
  }

  const isVisible = Boolean(config && config.enabled && (!dismissed || previewConfig));

  return (
    <AnimatePresence>
      {isVisible && config && (
        <motion.aside
          key="announcement-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          aria-label="Pengumuman Penting"
          className="relative z-30 overflow-hidden bg-gradient-to-r from-brand-950 via-emerald-950 to-brand-950 text-white shadow-inner border-b border-emerald-500/20"
        >
          <div className="px-4 py-2.5">
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
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
