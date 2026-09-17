import { HeroSection } from "./molecules/HeroSection";
import { HomeStatsSection } from "./molecules/HomeStatsSection";
import { TutorialSection } from "./molecules/TutorialSection";
import { FeaturedPrograms } from "./molecules/FeaturedPrograms";
import type { HeroSectionConfig, TutorialSectionConfig } from "@/types";
import { CtaTrustBanner } from "@/components/molecules/CtaTrustBanner";

interface LandingPageOrganismProps {
  heroConfig?: HeroSectionConfig;
  tutorialConfig?: TutorialSectionConfig;
}

export function LandingPageOrganism({ heroConfig, tutorialConfig }: LandingPageOrganismProps = {}) {
  return (
    <>
      {/* 1. HERO SECTION */}
      <HeroSection initialConfig={heroConfig} />

      {/* 2. STATS & TRANSPARENCY SECTION */}
      <HomeStatsSection />

      {/* 3. CARA KERJA (TUTORIAL) */}
      <section className="bg-brand-50/50 border-y border-brand-100/60 py-16 sm:py-20 lg:py-24">
        <TutorialSection initialConfig={tutorialConfig} />
      </section>

      {/* 4. FEATURED PROGRAMS SECTION */}
      <section className="py-16 sm:py-20 lg:py-24">
        <FeaturedPrograms />
      </section>

      {/* 5. CTA TRUST BANNER */}
      <section className="container-app pb-20 pt-4">
        <CtaTrustBanner />
      </section>
    </>
  );
}
