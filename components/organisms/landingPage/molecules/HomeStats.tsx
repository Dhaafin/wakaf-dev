"use client";

import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { CountUp } from "@/components/atoms/CountUp";
import { formatRupiahCompact } from "@/lib/format";

interface HomeStatsProps {
  /** Varian glassmorphism — kartu transparan untuk hero background gelap. */
  glass?: boolean;
}

// Counter statistik global landing page.
export function HomeStats({ glass = false }: HomeStatsProps) {
  const { data, loading } = useAsync(() => api.getStats(), []);

  const items = [
    {
      label: "Dana wakaf terkumpul",
      value: data?.totalTerkumpul ?? 0,
      fmt: (n: number) => formatRupiahCompact(n),
    },
    {
      label: "Jumlah wakif",
      value: data?.totalWakif ?? 0,
      fmt: (n: number) => n.toLocaleString("id-ID"),
    },
    {
      label: "Program aktif",
      value: data?.totalProgram ?? 0,
      fmt: (n: number) => n.toLocaleString("id-ID"),
    },
    {
      label: "Dana tersalurkan",
      value: data?.totalDisalurkan ?? 0,
      fmt: (n: number) => formatRupiahCompact(n),
    },
  ];

  if (glass) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur-md transition hover:bg-white/[0.11] sm:p-5"
          >
            {loading ? (
              <div className="mx-auto h-7 w-24 rounded-lg bg-white/10" />
            ) : (
              <p className="font-serif text-lg font-bold text-white sm:text-2xl">
                <CountUp value={it.value} format={it.fmt} />
              </p>
            )}
            <p className="mt-1 text-[11px] leading-tight text-brand-300/80 sm:text-xs">
              {it.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="card p-4 text-center transition hover:shadow-md sm:p-5"
        >
          {loading ? (
            <div className="skeleton mx-auto h-7 w-24" />
          ) : (
            <p className="font-serif text-lg font-bold text-brand-800 sm:text-2xl">
              <CountUp value={it.value} format={it.fmt} />
            </p>
          )}
          <p className="mt-1 text-[11px] leading-tight text-brand-500 sm:text-xs">
            {it.label}
          </p>
        </div>
      ))}
    </div>
  );
}
