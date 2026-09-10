"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession as useBetterAuthSession } from "@/lib/auth-client";
import { useSession } from "@/lib/store/session";
import { BrandLogo } from "@/components/atoms/BrandLogo";

const NAV = [
  { href: "/profil", label: "Profil" },
  { href: "/program", label: "Program" },
  { href: "/zakat", label: "Zakat" },
  { href: "/transparansi", label: "Transparansi" },
  { href: "/riwayat", label: "Riwayat" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: authSession } = useBetterAuthSession();
  const wakif = useSession((s) => s.wakif);

  const currentUser = authSession?.user
    ? { nama: authSession.user.name || authSession.user.email }
    : wakif;

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-sand-50/85 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Beranda KBM">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
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

        <div className="hidden items-center gap-2 lg:flex">
          {mounted && currentUser ? (
            <Link href="/riwayat" className="btn-outline px-4 py-2 text-xs">
              👤 {currentUser.nama.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login" className="btn-ghost px-4 py-2 text-xs">
              Masuk
            </Link>
          )}
          <Link href="/program" className="btn-primary px-4 py-2 text-xs">
            Tunaikan Sekarang
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-brand-800 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-sand-50 lg:hidden">
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
            <Link href="/program" className="btn-primary mt-2 w-full">
              Tunaikan Sekarang
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
