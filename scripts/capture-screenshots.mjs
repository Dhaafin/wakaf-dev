// ============================================================================
// Menangkap screenshot alur demo untuk README.
//
// Prasyarat: server demo jalan di http://localhost:3117 (`npm run build && npx
// next start -p 3117`) dan Google Chrome / Edge terpasang.
//
// Jalankan:  node scripts/capture-screenshots.mjs
// Output:    docs/screenshots/*.png
// ============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "docs", "screenshots");
const BASE = process.env.BASE_URL || "http://localhost:3117";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const chromePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chromePath) {
  console.error("Chrome/Edge tidak ditemukan. Set CHROME_PATH env var.");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  defaultViewport: { width: 1280, height: 900, deviceScaleFactor: 2 },
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});
const page = await browser.newPage();

async function shot(name, { full = false } = {}) {
  await sleep(900); // beri waktu skeleton -> data & animasi selesai
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: full,
  });
  console.log("✓", name);
}

async function goto(url) {
  // domcontentloaded, bukan networkidle2 — beberapa halaman polling terus
  // (mis. menunggu pembayaran) sehingga network tak pernah "idle".
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await sleep(600);
}

// 0. Reset data demo agar screenshot selalu dari kondisi seed yang sama.
await goto("/");
await page.evaluate(() =>
  fetch("/api/reset", { method: "POST" }).then((r) => r.json()),
);

// 1. Beranda
await goto("/");
await sleep(1600); // counter count-up selesai
await shot("01-beranda", { full: true });

// 2. Daftar program + filter
await goto("/program");
await shot("02-daftar-program", { full: true });

// 3. Detail program + form wakaf
await goto("/program/pembangunan-masjid-al-barokah");
await sleep(1200);
await shot("03-detail-program", { full: true });

// 4. Isi form wakaf
await page.evaluate(() => {
  const inputSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  const taSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value",
  ).set;
  const set = (sel, v) => {
    const el = document.querySelector(sel);
    if (!el) return;
    (el.tagName === "TEXTAREA" ? taSetter : inputSetter).call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  set("#nominal", "100000"); // RupiahInput mem-parse digit -> 100000
  set("#nama", "Andi Pratama");
  set("#email", "andi.pratama@contoh.id");
  set("#telepon", "081234550099");
});
await sleep(500);
await page.evaluate(() =>
  document.querySelector("#nominal")?.scrollIntoView({ block: "center" }),
);
await shot("04-form-wakaf-terisi");

// 5. Submit -> halaman menunggu pembayaran (countdown + VA)
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button[type=submit]")].find((b) =>
    b.textContent.includes("Lanjut ke pembayaran"),
  );
  btn?.click();
});
await page.waitForFunction(() => location.pathname.startsWith("/wakaf/"), {
  timeout: 20000,
});
await sleep(1800);
await shot("05-menunggu-pembayaran", { full: true });

// 6. Klik "Simulasikan pembayaran berhasil" -> redirect ke sukses
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent.includes("Simulasikan pembayaran berhasil"),
  );
  btn?.click();
});
await page.waitForFunction(() => location.pathname.startsWith("/sukses/"), {
  timeout: 15000,
});
await sleep(1500);
await shot("06-pembayaran-sukses", { full: true });

// 7. Sertifikat
await page.evaluate(() => {
  const a = [...document.querySelectorAll("a")].find((x) =>
    x.textContent.includes("Lihat & unduh sertifikat"),
  );
  a?.click();
});
await page.waitForFunction(() => location.pathname.startsWith("/sertifikat/"), {
  timeout: 15000,
});
await sleep(1400);
await shot("07-sertifikat", { full: true });

// 8. Detail program lagi — progress bertambah
await goto("/program/pembangunan-masjid-al-barokah");
await sleep(1400);
await shot("08-progress-terupdate", { full: true });

// 9. Verifikasi sertifikat
await goto("/verifikasi");
await page.evaluate(() => {
  const s = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  const el = document.querySelector('input[placeholder*="SW/"]') ||
    document.querySelector("input");
  s.call(el, "SW/2026/07/000001");
  el.dispatchEvent(new Event("input", { bubbles: true }));
  [...document.querySelectorAll("button")]
    .find((b) => b.textContent.trim() === "Verifikasi")
    ?.click();
});
await sleep(2200);
await shot("09-verifikasi-sertifikat", { full: true });

// 10. Admin — login lalu dashboard transaksi
await goto("/admin");
await page.evaluate(() => {
  const s = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  ).set;
  const set = (sel, v) => {
    const el = document.querySelector(sel);
    s.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  set("#email", "admin@kbm.or.id");
  set("#password", "admin123");
});
await sleep(300);
await page.evaluate(() =>
  [...document.querySelectorAll("button[type=submit]")]
    .find((b) => b.textContent.trim() === "Masuk")
    ?.click(),
);
await page
  .waitForFunction(() => location.pathname.startsWith("/admin/dashboard"), {
    timeout: 20000,
  })
  .catch(() => {});
await sleep(1600);
await page.evaluate(() =>
  [...document.querySelectorAll("button")]
    .find((b) => b.textContent.includes("Transaksi masuk"))
    ?.click(),
);
await sleep(1600);
await shot("10-admin-transaksi", { full: true });

// 11. Transparansi
await goto("/transparansi");
await sleep(1800);
await shot("11-transparansi", { full: true });

// --------------------------------------------------------------------------
// Pass mobile (390px) — membuktikan layout jalan di HP, bukan cuma desktop.
// --------------------------------------------------------------------------
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

await goto("/");
await sleep(1600);
await shot("mobile-01-beranda", { full: true });

await goto("/program");
await sleep(1400);
await shot("mobile-02-daftar-program", { full: true });

await goto("/program/pembangunan-masjid-al-barokah");
await sleep(1400);
await shot("mobile-03-detail-program", { full: true });

await browser.close();
console.log("\nSelesai. Lihat", OUT);
