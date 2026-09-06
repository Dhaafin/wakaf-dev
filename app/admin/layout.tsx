"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/store/session";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useSession((s) => s.admin);
  const logoutAdmin = useSession((s) => s.logoutAdmin);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoginPage = pathname === "/admin";

  // Lindungi halaman dalam area admin: kalau belum login, tendang ke /admin.
  useEffect(() => {
    if (mounted && !admin && !isLoginPage) router.replace("/admin");
  }, [mounted, admin, isLoginPage, router]);

  return (
    <div className="min-h-screen bg-brand-50">
      <header className="border-b border-brand-200 bg-brand-950 text-white">
        <div className="container-app flex h-14 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="relative inline-flex items-end rounded-lg bg-white px-1.5 py-0.5">
              <span className="font-sans text-sm font-extrabold leading-none tracking-tight text-brand-600">
                kbm
              </span>
              <span
                aria-hidden
                className="absolute right-0.5 top-0 h-0.5 w-2 -rotate-[30deg] rounded-full bg-accent-500"
              />
            </span>
            <span className="font-serif text-sm font-semibold">
              Panel Admin
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/" className="text-brand-200 hover:text-white">
              ↗ Situs publik
            </Link>
            {mounted && admin && (
              <button
                onClick={() => {
                  logoutAdmin();
                  router.replace("/admin");
                }}
                className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20"
              >
                Keluar
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="container-app py-8">{children}</div>
    </div>
  );
}
