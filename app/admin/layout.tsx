"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AdminSidebar } from "@/components/organisms/admin/AdminSidebar";

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
    <div className="flex min-h-screen flex-col bg-brand-50 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
