import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { AnnouncementBannerConfig, HeroSectionConfig, PaymentConfig, SiteSettings } from "@/types";

export const DEFAULT_TOP_BANNER: AnnouncementBannerConfig = {
  enabled: true,
  text: "🌙 Raih keberkahan jariyah: Salurkan wakaf dan sedekah terbaik Anda bersama Yayasan KBM",
  linkText: "Tunaikan Sekarang →",
  linkUrl: "/program",
};

export const DEFAULT_HERO_SECTION: HeroSectionConfig = {
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

export async function getHeroConfig(): Promise<HeroSectionConfig> {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "hero_section"))
      .limit(1);

    if (!rows || rows.length === 0) {
      return DEFAULT_HERO_SECTION;
    }

    const parsed = JSON.parse(rows[0].value) as Partial<HeroSectionConfig>;
    return {
      badge: parsed.badge?.trim() || DEFAULT_HERO_SECTION.badge,
      title: parsed.title?.trim() || DEFAULT_HERO_SECTION.title,
      titleHighlight: parsed.titleHighlight?.trim() || DEFAULT_HERO_SECTION.titleHighlight,
      description: parsed.description?.trim() || DEFAULT_HERO_SECTION.description,
      primaryCtaText: parsed.primaryCtaText?.trim() || DEFAULT_HERO_SECTION.primaryCtaText,
      primaryCtaUrl: parsed.primaryCtaUrl?.trim() || DEFAULT_HERO_SECTION.primaryCtaUrl,
      secondaryCtaText:
        parsed.secondaryCtaText !== undefined
          ? parsed.secondaryCtaText.trim()
          : DEFAULT_HERO_SECTION.secondaryCtaText,
      secondaryCtaUrl:
        parsed.secondaryCtaUrl !== undefined
          ? parsed.secondaryCtaUrl.trim()
          : DEFAULT_HERO_SECTION.secondaryCtaUrl,
      showSecondaryCta:
        typeof parsed.showSecondaryCta === "boolean"
          ? parsed.showSecondaryCta
          : DEFAULT_HERO_SECTION.showSecondaryCta,
    };
  } catch (err) {
    console.error("Error reading hero_section setting:", err);
    return DEFAULT_HERO_SECTION;
  }
}

export async function saveHeroConfig(
  config: HeroSectionConfig,
): Promise<HeroSectionConfig> {
  const valueJson = JSON.stringify({
    badge: config.badge?.trim() || DEFAULT_HERO_SECTION.badge,
    title: config.title?.trim() || DEFAULT_HERO_SECTION.title,
    titleHighlight: config.titleHighlight?.trim() || DEFAULT_HERO_SECTION.titleHighlight,
    description: config.description?.trim() || DEFAULT_HERO_SECTION.description,
    primaryCtaText: config.primaryCtaText?.trim() || DEFAULT_HERO_SECTION.primaryCtaText,
    primaryCtaUrl: config.primaryCtaUrl?.trim() || DEFAULT_HERO_SECTION.primaryCtaUrl,
    secondaryCtaText: config.secondaryCtaText?.trim() || "",
    secondaryCtaUrl: config.secondaryCtaUrl?.trim() || "",
    showSecondaryCta: Boolean(config.showSecondaryCta),
  });

  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "hero_section"))
    .limit(1);

  if (rows && rows.length > 0) {
    await db
      .update(siteSettings)
      .set({
        value: valueJson,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.key, "hero_section"));
  } else {
    await db.insert(siteSettings).values({
      key: "hero_section",
      value: valueJson,
      updatedAt: new Date(),
    });
  }

  return config;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  expiryDuration: 24,
  expiryUnit: "hours",
};

export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "payment_config"))
      .limit(1);

    if (!rows || rows.length === 0) {
      return DEFAULT_PAYMENT_CONFIG;
    }

    const parsed = JSON.parse(rows[0].value) as Partial<PaymentConfig>;
    return {
      expiryDuration:
        typeof parsed.expiryDuration === "number" ? parsed.expiryDuration : DEFAULT_PAYMENT_CONFIG.expiryDuration,
      expiryUnit:
        parsed.expiryUnit === "minutes" || parsed.expiryUnit === "hours" || parsed.expiryUnit === "days"
          ? parsed.expiryUnit
          : DEFAULT_PAYMENT_CONFIG.expiryUnit,
    };
  } catch (err) {
    console.error("Error reading payment_config setting:", err);
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export async function savePaymentConfig(
  config: PaymentConfig,
): Promise<PaymentConfig> {
  const valueJson = JSON.stringify({
    expiryDuration: config.expiryDuration,
    expiryUnit: config.expiryUnit,
  });

  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "payment_config"))
    .limit(1);

  if (rows && rows.length > 0) {
    await db
      .update(siteSettings)
      .set({
        value: valueJson,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.key, "payment_config"));
  } else {
    await db.insert(siteSettings).values({
      key: "payment_config",
      value: valueJson,
      updatedAt: new Date(),
    });
  }

  return config;
}

export async function getAllSiteSettings(): Promise<SiteSettings> {
  const [topBanner, hero, payment] = await Promise.all([
    getTopBannerConfig(),
    getHeroConfig(),
    getPaymentConfig(),
  ]);

  return {
    topBanner,
    hero,
    payment,
  };
}
