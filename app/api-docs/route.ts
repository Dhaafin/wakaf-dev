import type { NextRequest } from "next/server";
import { openApiDocument } from "@/lib/docs";

export const dynamic = "force-dynamic";

function checkBasicAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const separatorIndex = credentials.indexOf(":");
    if (separatorIndex === -1) return false;

    const username = credentials.substring(0, separatorIndex);
    const password = credentials.substring(separatorIndex + 1);

    const validUser = process.env.DOCS_USERNAME || "dhaafin";
    const validPass = process.env.DOCS_PASSWORD || "wertyer5321";

    return username === validUser && password === validPass;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  // 1. Verifikasi Akses Keamanan Basic Auth dari Environment
  if (!checkBasicAuth(req)) {
    return new Response(
      "Akses Terbatas: Silakan masukkan nama pengguna dan kata sandi dokumentasi API Yayasan KBM.",
      {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Akses Dokumentasi API Yayasan KBM"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    );
  }

  // 2. Jika pengguna meminta format raw JSON
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    return Response.json(openApiDocument);
  }

  // 3. Render Scalar Standalone API Reference (Emerald Theme)
  const specJson = JSON.stringify(openApiDocument);

  const html = `<!doctype html>
<html lang="id">
  <head>
    <title>API Reference | Yayasan Khazanah Berkah Mulia</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Dokumentasi resmi API platform Wakaf & Donasi Digital Yayasan Khazanah Berkah Mulia." />
    <link rel="icon" href="/favicon.ico" />
    <style>
      body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background-color: #061118;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      const spec = ${specJson};
      Scalar.createApiReference('#app', {
        content: spec,
        theme: 'emerald',
        layout: 'modern',
        showSidebar: true,
        hideDownloadButton: false,
        defaultHttpClient: {
          targetKey: 'javascript',
          clientKey: 'fetch',
        },
      });
    </script>
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
