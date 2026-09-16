import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/server";
import { getHeroConfig, saveHeroConfig } from "@/lib/settings";
import type { HeroSectionConfig } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/hero — Publik: Mendapatkan konten Hero Section Beranda
export async function GET() {
  try {
    const hero = await getHeroConfig();
    return ok(hero);
  } catch (err) {
    console.error("GET /api/hero error:", err);
    return fail("Gagal memuat konfigurasi Hero Section.", 500);
  }
}

// PUT /api/hero — Admin: Memperbarui konten Hero Section Beranda
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<HeroSectionConfig>;

    if (!body || !body.title?.trim() || !body.primaryCtaText?.trim() || !body.primaryCtaUrl?.trim()) {
      return fail("Judul, teks tombol utama, dan URL tautan utama wajib diisi.", 400);
    }

    const updated = await saveHeroConfig({
      badge: body.badge?.trim() || "Inovasi Wakaf Digital",
      title: body.title.trim(),
      titleHighlight: body.titleHighlight?.trim() || "",
      description: body.description?.trim() || "",
      primaryCtaText: body.primaryCtaText.trim(),
      primaryCtaUrl: body.primaryCtaUrl.trim(),
      secondaryCtaText: body.secondaryCtaText?.trim() || "",
      secondaryCtaUrl: body.secondaryCtaUrl?.trim() || "",
      showSecondaryCta: Boolean(body.showSecondaryCta),
    });

    return ok(updated);
  } catch (err) {
    console.error("PUT /api/hero error:", err);
    return fail(err instanceof Error ? err.message : "Gagal memperbarui konfigurasi Hero Section.", 500);
  }
}
