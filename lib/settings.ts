import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { AnnouncementBannerConfig, SiteSettings } from "@/types";

export const DEFAULT_TOP_BANNER: AnnouncementBannerConfig = {
  enabled: true,
  text: "🌙 Raih keberkahan jariyah: Salurkan wakaf dan sedekah terbaik Anda bersama Yayasan KBM",
  linkText: "Tunaikan Sekarang →",
  linkUrl: "/program",
};

export async function getTopBannerConfig(): Promise<AnnouncementBannerConfig> {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "top_banner"))
      .limit(1);

    if (!rows || rows.length === 0) {
      return DEFAULT_TOP_BANNER;
    }

    const parsed = JSON.parse(rows[0].value) as Partial<AnnouncementBannerConfig>;
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULT_TOP_BANNER.enabled,
      text: parsed.text?.trim() || DEFAULT_TOP_BANNER.text,
      linkText: parsed.linkText !== undefined ? parsed.linkText : DEFAULT_TOP_BANNER.linkText,
      linkUrl: parsed.linkUrl !== undefined ? parsed.linkUrl : DEFAULT_TOP_BANNER.linkUrl,
    };
  } catch (err) {
    console.error("Error reading top_banner setting:", err);
    return DEFAULT_TOP_BANNER;
  }
}

export async function saveTopBannerConfig(
  config: AnnouncementBannerConfig,
): Promise<AnnouncementBannerConfig> {
  const valueJson = JSON.stringify({
    enabled: Boolean(config.enabled),
    text: config.text.trim(),
    linkText: config.linkText?.trim() || "",
    linkUrl: config.linkUrl?.trim() || "",
  });

  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "top_banner"))
    .limit(1);

  if (rows && rows.length > 0) {
    await db
      .update(siteSettings)
      .set({
        value: valueJson,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.key, "top_banner"));
  } else {
    await db.insert(siteSettings).values({
      key: "top_banner",
      value: valueJson,
      updatedAt: new Date(),
    });
  }

  return config;
}

export async function getAllSiteSettings(): Promise<SiteSettings> {
  const topBanner = await getTopBannerConfig();
  return {
    topBanner,
  };
}
