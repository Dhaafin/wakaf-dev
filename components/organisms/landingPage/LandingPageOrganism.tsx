import Link from "next/link";
import { HeroSection } from "./molecules/HeroSection";
import { HomeStatsSection } from "./molecules/HomeStatsSection";
import { TutorialSection } from "./molecules/TutorialSection";
import { FeaturedPrograms } from "./molecules/FeaturedPrograms";
import {
  PROGRAM_TYPE_ORDER,
  PROGRAM_TYPE_LABEL,
  PROGRAM_TYPE_DESC,
  type HeroSectionConfig,
} from "@/types";

import { CtaTrustBanner } from "@/components/molecules/CtaTrustBanner";

interface LandingPageOrganismProps {
  heroConfig?: HeroSectionConfig;
}

export function LandingPageOrganism({ heroConfig }: LandingPageOrganismProps = {}) {
  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection initialConfig={heroConfig} />

      {/* 2. STATS & TRANSPARENCY SECTION */}
      <HomeStatsSection />

      {/* 3. JENIS PROGRAM */}
      <section className="container-app py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            Kategori Program
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-brand-950 sm:text-3xl lg:text-4xl">
            Pilih jenis kebaikan
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-emerald-500" />
          <p className="mx-auto mt-4 max-w-2xl text-sm text-brand-600 sm:text-base">
            Setiap jenis punya ketentuan dan cara pengelolaan yang berbeda.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_TYPE_ORDER.map((jenis) => (
            <Link
              key={jenis}
              href={`/program#${jenis}`}
              className="card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-brand-100/80"
            >
              <h3 className="font-serif text-lg font-semibold text-brand-950 group-hover:text-brand-700 transition-colors">
                {PROGRAM_TYPE_LABEL[jenis]}
              </h3>
              <p className="mt-2 text-sm text-brand-600 leading-relaxed">
                {PROGRAM_TYPE_DESC[jenis]}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:text-emerald-600 transition-colors">
                Lihat program →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/zakat" className="btn-outline inline-flex items-center gap-2">
            <span>🧮</span> Hitung zakat dulu
          </Link>
        </div>
      </section>

      {/* 4. CARA KERJA (TUTORIAL) */}
      <section className="bg-brand-50/50 border-y border-brand-100/60 py-16 sm:py-20 lg:py-24">
        <TutorialSection />
      </section>

      {/* 5. FEATURED PROGRAMS SECTION */}
      <section className="py-16 sm:py-20 lg:py-24">
        <FeaturedPrograms />
      </section>

      {/* 6. CTA TRUST BANNER */}
      <section className="container-app pb-20 pt-4">
        <CtaTrustBanner />
      </section>
    </>
  );
}
