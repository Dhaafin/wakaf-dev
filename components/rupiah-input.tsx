"use client";

import { formatNumber } from "@/lib/format";

// Input nominal rupiah dengan pemisah ribuan otomatis. Menyimpan nilai number
// murni ke parent lewat onChange(number | "").
export function RupiahInput({
  value,
  onChange,
  invalid,
  id,
  placeholder = "0",
}: {
  value: number | "";
  onChange: (v: number | "") => void;
  invalid?: boolean;
  id?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-500">
        Rp
      </span>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        className={`input pl-10 text-right text-base font-semibold tabular-nums ${
          invalid ? "input-error" : ""
        }`}
        placeholder={placeholder}
        value={value === "" ? "" : formatNumber(value)}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^\d]/g, "");
          onChange(digits === "" ? "" : Number(digits));
        }}
      />
    </div>
  );
}
