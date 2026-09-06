"use client";

import { api } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { CountUp } from "@/components/count-up";
import { formatRupiahCompact } from "@/lib/format";

// Counter statistik global. Angka "jumlah wakif" & "dana terkumpul" dibaca dari
// /api/stats (mock-db yang sama dengan yang di-update saat pembayaran mock
// sukses), jadi ikut bertambah setelah transaksi.
export function HomeStats() {
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
