import { LandingPageOrganism } from "@/components/organisms/landingPage/LandingPageOrganism";
import { getHeroConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BerandaPage() {
  const heroConfig = await getHeroConfig();
  return <LandingPageOrganism heroConfig={heroConfig} />;
}

