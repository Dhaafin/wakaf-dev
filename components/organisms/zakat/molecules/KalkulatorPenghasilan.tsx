"use client";

import { useMemo, useState } from "react";
import { RupiahInput } from "@/components/molecules/RupiahInput";
import { HasilPanel } from "./HasilPanel";
import {
  NISAB_EMAS_GRAM,
  HARGA_EMAS_PER_GRAM,
  KADAR_ZAKAT,
  PROGRAM_ZAKAT_PENGHASILAN,
} from "@/lib/config";

const NISAB_MAAL = NISAB_EMAS_GRAM * HARGA_EMAS_PER_GRAM;

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <RupiahInput value={value} onChange={onChange} />
    </div>
  );
}

export function KalkulatorPenghasilan() {
  const [gaji, setGaji] = useState<number | "">("");
  const [lain, setLain] = useState<number | "">("");
  const [kebutuhan, setKebutuhan] = useState<number | "">("");

  const netoBulanan = useMemo(() => {
    const n = (v: number | "") => (v === "" ? 0 : v);
    return Math.max(0, n(gaji) + n(lain) - n(kebutuhan));
  }, [gaji, lain, kebutuhan]);

  const nisabBulanan = Math.round(NISAB_MAAL / 12);
  const wajib = netoBulanan >= nisabBulanan;
  const zakat = wajib ? Math.round(netoBulanan * KADAR_ZAKAT) : 0;
  const adaInput = [gaji, lain, kebutuhan].some((v) => v !== "");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-brand-950">
          Penghasilan per bulan
        </h2>
        <div className="mt-4 space-y-4">
          <Field label="Gaji & tunjangan rutin" value={gaji} onChange={setGaji} />
          <Field
            label="Penghasilan lain (bonus, usaha sampingan)"
            value={lain}
            onChange={setLain}
          />
          <Field
            label="Kebutuhan pokok bulanan (pengurang, opsional)"
            value={kebutuhan}
            onChange={setKebutuhan}
          />
        </div>
        <p className="mt-4 text-xs text-brand-400">
          Sebagian ulama membolehkan zakat penghasilan dihitung dari penghasilan
          bruto tanpa pengurang. Kosongkan kolom terakhir bila memilih cara itu.
        </p>
      </div>

      <HasilPanel
        adaInput={adaInput}
        rows={[
          ["Penghasilan dihitung", netoBulanan],
          ["Nisab per bulan", nisabBulanan],
        ]}
        wajib={wajib}
        zakat={zakat}
        satuan="/bulan"
        pesanBelumWajib="Penghasilan Anda belum mencapai nisab bulanan, sehingga belum wajib zakat penghasilan."
        programSlug={PROGRAM_ZAKAT_PENGHASILAN}
      />
    </div>
  );
}
