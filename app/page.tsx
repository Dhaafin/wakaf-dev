import { LandingPageOrganism } from "@/components/organisms/landingPage/LandingPageOrganism";
import { getHeroConfig, getTutorialConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BerandaPage() {
  const [heroConfig, tutorialConfig] = await Promise.all([
    getHeroConfig(),
    getTutorialConfig(),
  ]);
  return <LandingPageOrganism heroConfig={heroConfig} tutorialConfig={tutorialConfig} />;
}

