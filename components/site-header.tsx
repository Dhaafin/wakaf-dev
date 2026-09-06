"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/store/session";
import { BrandLogo } from "@/components/brand-logo";

const NAV = [
  { href: "/program", label: "Program" },
  { href: "/transparansi", label: "Transparansi" },
  { href: "/riwayat", label: "Riwayat Saya" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wakif = useSession((s) => s.wakif);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  // Sembunyikan header publik di area admin (punya layout sendiri).
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-sand-50/85 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Beranda KBM">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname?.startsWith(n.href)
                  ? "bg-brand-100 text-brand-900"
                  : "text-brand-700 hover:bg-brand-50"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {mounted && wakif ? (
            <Link href="/riwayat" className="btn-outline px-4 py-2 text-xs">
              👤 {wakif.nama.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/riwayat" className="btn-ghost px-4 py-2 text-xs">
              Masuk
            </Link>
          )}
          <Link href="/program" className="btn-primary px-4 py-2 text-xs">
            Wakaf Sekarang
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-brand-800 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-sand-50 md:hidden">
          <nav className="container-app flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-800 hover:bg-brand-50"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/program"
              className="btn-primary mt-2 w-full"
            >
              Wakaf Sekarang
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
