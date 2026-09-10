"use client";

import Link from "next/link";
import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { ProgramCard } from "@/components/molecules/ProgramCard";
import { ProgramGridSkeleton } from "@/components/molecules/ProgramCardSkeleton";


export function FeaturedPrograms() {
  const { data, loading, error } = useAsync(() => api.listPrograms(), []);

  const programs = (data?.items ?? [])
    .slice()
    .sort((a, b) => b.terkumpul / b.target - a.terkumpul / a.target)
    .slice(0, 3);


  return (
    <section className="container-app py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
            Program pilihan
          </h2>
          <p className="mt-1 text-sm text-brand-600">
            Yang paling dekat menuju target — wakaf Anda melengkapi sisanya.
          </p>
        </div>
        <Link
          href="/program"
          className="hidden shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-900 sm:block"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <ProgramGridSkeleton count={3} />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </div>

      <Link
        href="/program"
        className="btn-outline mt-8 w-full sm:hidden"
      >
        Lihat semua program
      </Link>
    </section>
  );
}
