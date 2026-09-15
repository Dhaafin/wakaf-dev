import Link from "next/link";
import { HeroSection } from "./molecules/HeroSection";
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
      {/* HERO SECTION */}
      <HeroSection initialConfig={heroConfig} />

      {/* JENIS PROGRAM */}
      <section className="container-app py-14">
        <h2 className="text-center font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
          Pilih jenis kebaikan
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-brand-600">
          Setiap jenis punya ketentuan dan cara pengelolaan yang berbeda.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_TYPE_ORDER.map((jenis) => (
            <Link
              key={jenis}
              href={`/program#${jenis}`}
              className="card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-serif text-lg font-semibold text-brand-950">
                {PROGRAM_TYPE_LABEL[jenis]}
              </h3>
              <p className="mt-2 text-sm text-brand-600">
                {PROGRAM_TYPE_DESC[jenis]}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-700 group-hover:text-brand-900">
                Lihat program →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/zakat" className="btn-outline">
            🧮 Hitung zakat dulu
          </Link>
        </div>
      </section>

      {/* CARA KERJA (TUTORIAL) */}
      <TutorialSection />

      {/* FEATURED PROGRAMS SECTION */}
      <FeaturedPrograms />

      {/* CTA TRUST */}
      <section className="container-app pb-16">
        <CtaTrustBanner />
      </section>
    </>
  );
}
