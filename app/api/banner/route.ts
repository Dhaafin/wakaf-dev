import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/server";
import { getTopBannerConfig, saveTopBannerConfig } from "@/lib/settings";
import type { AnnouncementBannerConfig } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/banner — Publik: Mendapatkan status dan konten banner pengumuman atas
export async function GET() {
  try {
    const banner = await getTopBannerConfig();
    return ok(banner);
  } catch (err) {
    console.error("GET /api/banner error:", err);
    return fail("Gagal memuat pengaturan banner.", 500);
  }
}

// PUT /api/banner — Admin: Memperbarui isi dan status banner pengumuman atas
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<AnnouncementBannerConfig>;

    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return fail("Teks pengumuman banner wajib diisi.", 400);
    }

    const updated = await saveTopBannerConfig({
      enabled: Boolean(body.enabled),
      text: body.text.trim(),
      linkText: body.linkText?.trim() || "",
      linkUrl: body.linkUrl?.trim() || "",
    });

    return ok(updated);
  } catch (err) {
    console.error("PUT /api/banner error:", err);
    return fail(err instanceof Error ? err.message : "Gagal memperbarui pengaturan banner.", 500);
  }
}
