"use client";

import { motion, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api/client";
import type { HeroSectionConfig } from "@/types";

const DEFAULT_CONFIG: HeroSectionConfig = {
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

// Crisp, high-end editorial easing (Apple's signature smooth ease)
const customEase = [0.16, 1, 0.3, 1] as const;

interface HeroSectionProps {
  /** Injeksi data awal dari server component (app/page.tsx) */
  initialConfig?: HeroSectionConfig;
  /** Digunakan oleh panel Admin Settings untuk live preview */
  previewConfig?: HeroSectionConfig;
  /** Mode pratinjau ringkas untuk panel admin */
  isCompactPreview?: boolean;
}

export function HeroSection({
  initialConfig,
  previewConfig,
  isCompactPreview = false,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [config, setConfig] = useState<HeroSectionConfig>(
    previewConfig ?? initialConfig ?? DEFAULT_CONFIG,
  );

  // Track image loading state for clean fade-in
  const [bgLoaded, setBgLoaded] = useState(false);
  const [leftImgLoaded, setLeftImgLoaded] = useState(false);
  const [rightImgLoaded, setRightImgLoaded] = useState(false);

  // Update realtime jika prop previewConfig berubah di admin
  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
    }
  }, [previewConfig]);

  // Jika tidak ada initialConfig atau previewConfig (misal di-mount murni client side)
  useEffect(() => {
    if (initialConfig || previewConfig) return;

    let active = true;
    api
      .getHero()
      .then((data) => {
        if (!active || !data) return;
        setConfig(data);
      })
      .catch(() => {
        /* fallback ke DEFAULT_CONFIG */
      });

    return () => {
      active = false;
    };
  }, [initialConfig, previewConfig]);

  // Scroll Parallax
  useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Clean stagger orchestration for entrance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  // Sharper, more dramatic vertical reveal
  const item = {
    hidden: { opacity: 0, y: isCompactPreview ? 20 : 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: isCompactPreview ? 0.6 : 1.2, ease: customEase },
    },
  };

  return (
    <section 
      ref={containerRef}
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden bg-brand-950 ${
        isCompactPreview
          ? "min-h-[440px] py-12 rounded-lg border border-brand-800"
          : "min-h-[calc(100vh-110px)] pt-12 pb-24"
      }`}
    >
      {/* 1. Structural & Photographic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Top Mosque Background */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-[60vh]"
          style={{ 
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
          }}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: bgLoaded ? 0.35 : 0, 
            scale: bgLoaded ? [1, 1.05, 1] : 1 
          }}
          transition={{ 
             opacity: { duration: 1.5, ease: "easeOut" },
             scale: { duration: 30, repeat: Infinity, ease: "linear" }
          }}
        >
          <Image
            src="/hero-mosque.jpg"
            alt="Latar Masjid KBM"
            fill
            className="object-cover object-top mix-blend-luminosity opacity-40 grayscale"
            priority={!isCompactPreview}
            onLoad={() => setBgLoaded(true)}
          />
        </motion.div>
        
        {/* Infinite shifting architectural grid */}
        <motion.div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}
          animate={{ backgroundPosition: ['0px 0px', '64px 64px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Bottom Left Blended Image (Disaster 2) */}
        {!isCompactPreview && (
          <motion.div 
            className="absolute -bottom-16 -left-32 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] mix-blend-overlay"
            style={{ 
              WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)',
              maskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)'
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: leftImgLoaded ? 0.35 : 0,
              y: leftImgLoaded ? [0, -15, 0] : 0,
              rotate: leftImgLoaded ? [0, 1, 0] : 0 
            }}
            transition={{ 
               opacity: { duration: 1.5, ease: "easeOut" },
               y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
               rotate: { duration: 15, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Image 
               src="/hero-disaster-2.jpg" 
               alt="Dampak Bencana" 
               fill 
               className="object-cover grayscale" 
               onLoad={() => setLeftImgLoaded(true)}
            />
          </motion.div>
        )}

        {/* Bottom Right Blended Image (Disaster 3) */}
        {!isCompactPreview && (
          <motion.div 
            className="absolute -bottom-10 -right-32 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] mix-blend-overlay"
            style={{ 
              WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)',
              maskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)'
            }}
            initial={{ opacity: 0 }}
            animate={{ 
               opacity: rightImgLoaded ? 0.35 : 0,
               y: rightImgLoaded ? [0, 15, 0] : 0, 
               rotate: rightImgLoaded ? [0, -1, 0] : 0 
            }}
            transition={{ 
               opacity: { duration: 1.5, ease: "easeOut", delay: 0.2 },
               y: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 },
               rotate: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }}
          >
            <Image 
              src="/hero-disaster-3.jpg" 
              alt="Bantuan Kemanusiaan" 
              fill 
              className="object-cover grayscale" 
              onLoad={() => setRightImgLoaded(true)}
            />
          </motion.div>
        )}

      </div>

      {/* 2. Editorial Content Container */}
      <motion.div 
        className={`container-app relative z-20 flex flex-col items-center text-center px-4 ${
          isCompactPreview ? "max-w-3xl" : ""
        }`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Subtle, slowly rotating Islamic geometric emblem (Rub el Hizb) */}
        <motion.div
          variants={item}
          className={`${isCompactPreview ? "mb-4" : "mb-8"} text-brand-400/10`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <svg width={isCompactPreview ? 36 : 48} height={isCompactPreview ? 36 : 48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
              <rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* Anti-Slop Label: Classic editorial lines */}
        {config.badge && (
          <motion.div variants={item} className={`${isCompactPreview ? "mb-4" : "mb-6"} flex items-center justify-center gap-4`}>
            <div className="h-px w-8 bg-brand-400/30" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-brand-300/80">
              {config.badge}
            </span>
            <div className="h-px w-8 bg-brand-400/30" />
          </motion.div>
        )}

        {/* Masterpiece Typography */}
        <motion.h1 
          variants={item}
          className={`font-serif font-medium leading-[1.08] tracking-tight text-white ${
            isCompactPreview
              ? "text-2xl sm:text-3xl lg:text-4xl max-w-2xl"
              : "max-w-4xl text-[3.25rem] sm:text-[4.75rem] lg:text-[5.5rem]"
          }`}
        >
          {config.title}{" "}
          {config.titleHighlight && (
            <>
              <br className="hidden sm:block" />
              <span className="italic text-emerald-400">
                {config.titleHighlight}
              </span>
            </>
          )}
        </motion.h1>

        {/* Descriptive Text */}
        {config.description && (
          <motion.p
            variants={item}
            className={`${
              isCompactPreview
                ? "mt-4 text-xs sm:text-sm max-w-[500px]"
                : "mt-8 max-w-[600px] text-lg"
            } leading-relaxed text-brand-100/70`}
          >
            {config.description}
          </motion.p>
        )}
        
        {/* Buttons */}
        <motion.div
          variants={item}
          className={`${isCompactPreview ? "mt-6" : "mt-12"} flex flex-wrap justify-center gap-3 sm:gap-4`}
        >
          {config.primaryCtaText && (
            <Link
              href={config.primaryCtaUrl || "/program"}
              className={`group flex items-center justify-center gap-2 rounded-sm bg-emerald-500 font-semibold text-brand-950 transition-all hover:bg-emerald-400 shadow-[0_0_0_0_rgba(52,211,153,0)] hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.4)] ${
                isCompactPreview
                  ? "h-10 px-5 text-xs"
                  : "h-14 px-8 text-sm"
              }`}
            >
              {config.primaryCtaText}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
          
          {config.showSecondaryCta && config.secondaryCtaText && (
            <Link
              href={config.secondaryCtaUrl || "/zakat"}
              className={`flex items-center justify-center rounded-sm border border-brand-700 bg-transparent font-semibold text-brand-100 transition-colors hover:bg-brand-900/50 hover:border-brand-500 ${
                isCompactPreview
                  ? "h-10 px-5 text-xs"
                  : "h-14 px-8 text-sm"
              }`}
            >
              {config.secondaryCtaText}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

