"use client";

import { HomeStats } from "./HomeStats";

export function HomeStatsSection() {
  return (
    <section className="bg-brand-50/50 border-y border-brand-100/70 py-16 sm:py-20 lg:py-24">
      <div className="container-app">
        <div className="mb-12 text-center">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            Transparansi & Dampak Real-Time
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold text-brand-950 sm:text-3xl lg:text-4xl">
            Amanah terkelola, dampak terus mengalir
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-emerald-500" />
          <p className="mx-auto mt-4 max-w-2xl text-sm text-brand-600 sm:text-base">
            Setiap rupiah dana wakaf dan donasi yang Anda salurkan tercatat secara rinci dan dilaporkan secara tembus pandang.
          </p>
        </div>
        <HomeStats />
      </div>
    </section>
  );
}
