import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/server";
import { getTutorialConfig, saveTutorialConfig } from "@/lib/settings";
import type { TutorialSectionConfig } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/tutorial — Publik: Mendapatkan konten Tutorial Langkah Beranda
export async function GET() {
  try {
    const tutorial = await getTutorialConfig();
    return ok(tutorial);
  } catch (err) {
    console.error("GET /api/tutorial error:", err);
    return fail("Gagal memuat konfigurasi Langkah Tutorial.", 500);
  }
}

// PUT /api/tutorial — Admin: Memperbarui konten Tutorial Langkah Beranda
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<TutorialSectionConfig>;

    if (!body || !body.title?.trim() || !Array.isArray(body.steps) || body.steps.length === 0) {
      return fail("Judul section dan minimal 1 langkah tutorial wajib diisi.", 400);
    }

    const updated = await saveTutorialConfig({
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || "",
      steps: body.steps.map((s, idx) => ({
        stepNumber: s.stepNumber?.trim() || String(idx + 1).padStart(2, "0"),
        title: s.title?.trim() || `Langkah ${idx + 1}`,
        description: s.description?.trim() || "",
        icon: s.icon || "check",
        imageUrl: s.imageUrl?.trim() || "",
      })),
    });

    return ok(updated);
  } catch (err) {
    console.error("PUT /api/tutorial error:", err);
    return fail(
      err instanceof Error ? err.message : "Gagal memperbarui konfigurasi Tutorial.",
      500,
    );
  }
}
