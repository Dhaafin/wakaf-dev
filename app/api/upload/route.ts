import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Verifikasi ketersediaan token Vercel Blob di environment
  const blobToken =
    process.env.KBM_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    return NextResponse.json(
      {
        error:
          "Token Vercel Blob belum dikonfigurasi pada server (KBM_READ_WRITE_TOKEN / BLOB_READ_WRITE_TOKEN). Silakan tambahkan token terlebih dahulu pada .env.local.",
      },
      { status: 500 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json(
      { error: "Format request body tidak valid." },
      { status: 400 },
    );
  }

  try {
    const jsonResponse = await handleUpload({
      token: blobToken,
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // 2. Verifikasi hak akses admin melalui session Better Auth
        const session = await auth.api.getSession({
          headers: await headers(),
        });

        if (!session || session.user.role !== "admin") {
          throw new Error("Akses ditolak: Hanya admin yang diizinkan mengunggah file.");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
          ],
          maximumSizeInBytes: 5 * 1024 * 1024, // Batas maksimal 5MB
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            uploadedAt: new Date().toISOString(),
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Callback saat upload selesai di storage Vercel Blob
        // Note: Untuk testing lokal callback ini membutuhkan public tunnel (ngrok)
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memproses token upload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
