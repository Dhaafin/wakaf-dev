import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/server";
import { getAllSiteSettings, saveTopBannerConfig } from "@/lib/settings";
import type { SiteSettings } from "@/types";

export const dynamic = "force-dynamic";

// GET /api/settings — Mengambil seluruh konfigurasi situs
export async function GET() {
  try {
    const settings = await getAllSiteSettings();
    return ok(settings);
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return fail("Gagal memuat pengaturan website.", 500);
  }
}

// PUT /api/settings — Memperbarui pengaturan situs
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SiteSettings>;

    if (body.topBanner) {
      await saveTopBannerConfig(body.topBanner);
    }

    const updated = await getAllSiteSettings();
    return ok(updated);
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    return fail("Gagal memperbarui pengaturan website.", 500);
  }
}
