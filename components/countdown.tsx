"use client";

import { useEffect, useRef, useState } from "react";
import { breakdownDuration, pad2 } from "@/lib/format";

// Countdown mundur menuju `expiresAt` (ISO). Benar-benar berjalan (interval 1s).
// DEMO: durasi total aslinya 24 jam, tapi dipercepat jadi ~3 menit
// (lihat lib/config.ts -> VA_TTL_MS). Komponen ini tidak peduli berapa
// durasinya — ia hanya menghitung selisih ke `expiresAt`.
export function Countdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string;
  onExpire?: () => void;
}) {
  const target = new Date(expiresAt).getTime();
  const [now, setNow] = useState(() => Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const sisa = target - now;
  const { jam, menit, detik, habis } = breakdownDuration(sisa);

  useEffect(() => {
    if (habis && !firedRef.current) {
      firedRef.current = true;
      onExpire?.();
    }
  }, [habis, onExpire]);

  const seg = (val: string, label: string) => (
    <div className="flex flex-col items-center">
      <span className="tabular-nums font-serif text-3xl font-bold text-brand-950 sm:text-4xl">
        {val}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-brand-400">
        {label}
      </span>
    </div>
  );

  return (
    <div
      className={`flex items-center justify-center gap-3 rounded-2xl border p-5 transition-colors sm:gap-5 ${
        sisa < 60_000
          ? "border-red-200 bg-red-50"
          : "border-brand-100 bg-brand-50"
      }`}
      role="timer"
      aria-live="polite"
    >
      {seg(pad2(jam), "Jam")}
      <span className="font-serif text-2xl text-brand-300">:</span>
      {seg(pad2(menit), "Menit")}
      <span className="font-serif text-2xl text-brand-300">:</span>
      {seg(pad2(detik), "Detik")}
    </div>
  );
}
