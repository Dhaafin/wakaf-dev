"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession as useBetterAuthSession, signOut } from "@/lib/auth-client";
import { useSession } from "@/lib/store/session";
import { BrandLogo } from "@/components/atoms/BrandLogo";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "/profil", label: "Profil" },
  { href: "/program", label: "Program" },
  { href: "/zakat", label: "Zakat" },
  { href: "/transparansi", label: "Transparansi" },
  { href: "/riwayat", label: "Riwayat" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: authSession } = useBetterAuthSession();
  const wakif = useSession((s) => s.wakif);
  const logoutWakif = useSession((s) => s.logoutWakif);

  const currentUser = authSession?.user
    ? { nama: authSession.user.name || authSession.user.email }
    : wakif;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    if (authSession?.user) {
      await signOut();
    }
    if (wakif) {
      logoutWakif();
    }
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  };

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
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`btn-outline px-4 py-2 text-xs flex items-center gap-2 transition-colors ${
                  profileOpen ? "bg-brand-50 border-brand-300" : ""
                }`}
              >
                <span>👤</span>
                <span className="font-semibold">{currentUser.nama.split(" ")[0]}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-brand-100 bg-white shadow-xl shadow-brand-900/5 py-1 z-50 overflow-hidden"
                  >
                    <Link
                      href="/riwayat"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-700 hover:bg-brand-50 transition-colors w-full text-left"
                    >
                      📄 Riwayat Transaksi
                    </Link>
                    <div className="h-px bg-brand-50 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left font-medium"
                    >
                      Keluar Akun
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="btn-ghost px-4 py-2 text-xs">
              Masuk
            </Link>
          )}
          <Link href="/program" className="btn-primary px-4 py-2 text-xs">
            Tunaikan Sekarang
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {mounted && currentUser && (
            <Link href="/riwayat" className="rounded-lg p-2 text-brand-700 hover:bg-brand-50 text-sm">
              👤
            </Link>
          )}
          <button
            className="rounded-lg p-2 text-brand-800"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
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
            {mounted && currentUser ? (
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 text-left mt-2"
              >
                Keluar Akun
              </button>
            ) : (
              <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-800 hover:bg-brand-50">
                Masuk
              </Link>
            )}
            <Link href="/program" className="btn-primary mt-2 w-full">
              Tunaikan Sekarang
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
