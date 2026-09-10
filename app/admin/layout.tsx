"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Guard: hanya user dengan role admin yang boleh berada di layout admin
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const user = session?.user as { role?: string; name?: string } | undefined;
  if (!session || user?.role !== "admin") {
    router.replace(session ? "/riwayat" : "/login");
    return null;
  }

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
            <button
              onClick={async () => {
                await signOut();
                router.replace("/login");
              }}
              className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
      <div className="container-app py-8">{children}</div>
    </div>
  );
}
