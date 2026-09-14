"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";

const NAV_ITEMS = [
  {
    id: "ringkasan",
    label: "Ringkasan",
    href: "/admin/dashboard?tab=ringkasan",
    // Clean SVG icon: Grid / Dashboard
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: "transaksi",
    label: "Transaksi Masuk",
    href: "/admin/transaksi",
    // Clean SVG icon: Credit card / receipt
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" />
      </svg>
    ),
  },
  {
    id: "program",
    label: "Kelola Program",
    href: "/admin/program",
    // Clean SVG icon: Folder / Program
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    id: "penyaluran",
    label: "Penyaluran Dana",
    href: "/admin/penyaluran",
    // Clean SVG icon: Arrows transfer / hand-heart
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    id: "pengaturan",
    label: "Pengaturan Website",
    href: "/admin/pengaturan",
    // Clean SVG icon: Sliders / Settings
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "ringkasan";
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-brand-950 text-white select-none">
      <div>
        {/* LOGO & ADMIN PANEL UNIFIED HEADER */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.08]">
          <Link
            href="/admin/dashboard"
            className="group flex items-center gap-3 transition-opacity hover:opacity-95"
          >
            <span className="relative inline-flex items-end rounded-lg bg-white px-2 py-0.5 shadow-sm ring-1 ring-white/10">
              <span className="font-sans text-xs font-black tracking-tight text-brand-600">
                kbm
              </span>
              <span
                aria-hidden
                className="absolute -top-0.5 right-0.5 h-0.5 w-2 -rotate-[30deg] rounded-full bg-accent-500"
              />
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-semibold tracking-wide text-white leading-tight">
                Admin Panel
              </span>
              <span className="text-[10px] tracking-wider text-brand-300/80 font-sans font-medium uppercase">
                Yayasan KBM
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-brand-300 hover:bg-white/10 lg:hidden"
            aria-label="Tutup Menu"
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="p-3 space-y-1">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-400/80">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.id === "transaksi"
                ? pathname.startsWith("/admin/transaksi") ||
                  (pathname === "/admin/dashboard" && activeTab === "transaksi")
                : item.id === "program"
                ? pathname.startsWith("/admin/program")
                : item.id === "penyaluran"
                ? pathname.startsWith("/admin/penyaluran") ||
                  (pathname === "/admin/dashboard" && activeTab === "penyaluran")
                : item.id === "pengaturan"
                ? pathname.startsWith("/admin/pengaturan")
                : pathname === "/admin/dashboard" && activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-brand-700/80 text-white font-semibold shadow-inner"
                    : "text-brand-200/80 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive ? "text-white" : "text-brand-300/70 group-hover:text-brand-100"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER ACTIONS & MINIMAL USER PROFILE */}
      <div className="border-t border-white/[0.08] p-3 space-y-1.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-brand-300/90 transition hover:bg-white/[0.06] hover:text-white"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span>Situs Publik</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-300/85 transition hover:bg-red-500/15 hover:text-red-200"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>Keluar</span>
          {user?.email && (
            <span className="ml-auto truncate max-w-[90px] text-[10px] text-white/40 font-normal">
              {user.email.split("@")[0]}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TRIGGER BAR */}
      <div className="flex h-14 items-center justify-between border-b border-brand-900/40 bg-brand-950 px-4 text-white lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <span className="relative inline-flex items-end rounded-lg bg-white px-1.5 py-0.5 shadow-sm">
            <span className="font-sans text-[11px] font-black text-brand-600">kbm</span>
          </span>
          <span className="font-serif text-sm font-semibold tracking-wide">Admin Panel</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-white/15 px-3 py-1 text-xs font-medium text-brand-100 hover:bg-white/10"
        >
          Menu
        </button>
      </div>

      {/* MOBILE DRAWER BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* DESKTOP STATIC SIDEBAR */}
      <aside className="hidden h-screen w-60 shrink-0 border-r border-brand-900/30 lg:sticky lg:top-0 lg:block">
        {sidebarContent}
      </aside>
    </>
  );
}
