"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";

export interface AdminNavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
}

interface AdminSidebarProps {
  activeTab?: string;
  onTabChange?: (id: string) => void;
  tabs?: readonly { id: string; label: string }[];
}

const DEFAULT_ITEMS = [
  { id: "ringkasan", label: "Ringkasan", icon: "📊" },
  { id: "transaksi", label: "Transaksi Masuk", icon: "💳" },
  { id: "program", label: "Kelola Program", icon: "🕌" },
  { id: "penyaluran", label: "Penyaluran Dana", icon: "🤝" },
];

export function AdminSidebar({
  activeTab = "ringkasan",
  onTabChange,
  tabs,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = tabs
    ? tabs.map((t) => {
        const found = DEFAULT_ITEMS.find((d) => d.id === t.id);
        return {
          id: t.id,
          label: t.label,
          icon: found?.icon || "📁",
        };
      })
    : DEFAULT_ITEMS;

  const user = session?.user;

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-brand-950 text-white">
      {/* BRAND & HEADER */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="relative inline-flex items-end rounded-lg bg-white px-2 py-0.5 shadow-sm">
              <span className="font-sans text-sm font-extrabold leading-none tracking-tight text-brand-600">
                kbm
              </span>
              <span
                aria-hidden
                className="absolute right-0.5 top-0 h-0.5 w-2 -rotate-[30deg] rounded-full bg-accent-500"
              />
            </span>
            <span className="font-serif text-sm font-semibold tracking-wide">
              Panel Pengelola
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-brand-200 hover:bg-white/10 lg:hidden"
            aria-label="Tutup Sidebar"
          >
            ✕
          </button>
        </div>

        {/* ADMIN PROFILE SNIPPET */}
        <div className="border-b border-white/10 px-6 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-brand-300">
            Masuk Sebagai
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {user?.name || "Administrator"}
          </p>
          <p className="truncate text-xs text-brand-400">
            {user?.email || "admin@kbm.id"}
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1.5 px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-brand-400">
            Menu Utama
          </p>
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange?.(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-600 font-semibold text-white shadow-sm"
                    : "text-brand-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-semibold text-brand-200 transition hover:bg-white/10 hover:text-white"
        >
          <span>↗</span>
          <span>Buka Situs Publik</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600/20 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-600/30 hover:text-red-200"
        >
          <span>🚪</span>
          <span>Keluar Akun</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TRIGGER BAR */}
      <div className="flex h-14 items-center justify-between border-b border-brand-200 bg-brand-950 px-4 text-white lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="relative inline-flex items-end rounded-lg bg-white px-1.5 py-0.5">
            <span className="font-sans text-xs font-extrabold text-brand-600">
              kbm
            </span>
          </span>
          <span className="font-serif text-sm font-semibold">Panel Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
        >
          ☰ Menu
        </button>
      </div>

      {/* MOBILE DRAWER BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* DESKTOP STATIC SIDEBAR */}
      <aside className="hidden h-screen w-64 shrink-0 border-r border-brand-900/50 lg:sticky lg:top-0 lg:block">
        {sidebarContent}
      </aside>
    </>
  );
}
