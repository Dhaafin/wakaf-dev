"use client";

import { useMemo, useState } from "react";
import { RupiahInput } from "@/components/molecules/RupiahInput";
import { HasilPanel } from "./HasilPanel";
import {
  NISAB_EMAS_GRAM,
  HARGA_EMAS_PER_GRAM,
  KADAR_ZAKAT,
  PROGRAM_ZAKAT_MAAL,
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

export function KalkulatorMaal() {
  const [kas, setKas] = useState<number | "">("");
  const [emas, setEmas] = useState<number | "">("");
  const [investasi, setInvestasi] = useState<number | "">("");
  const [piutang, setPiutang] = useState<number | "">("");
  const [hutang, setHutang] = useState<number | "">("");

  const hartaBersih = useMemo(() => {
    const n = (v: number | "") => (v === "" ? 0 : v);
    return n(kas) + n(emas) + n(investasi) + n(piutang) - n(hutang);
  }, [kas, emas, investasi, piutang, hutang]);

  const wajib = hartaBersih >= NISAB_MAAL;
  const zakat = wajib ? Math.round(hartaBersih * KADAR_ZAKAT) : 0;
  const adaInput = [kas, emas, investasi, piutang, hutang].some((v) => v !== "");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-brand-950">
          Harta yang dimiliki satu haul
        </h2>
        <div className="mt-4 space-y-4">
          <Field label="Kas, tabungan & deposito" value={kas} onChange={setKas} />
          <Field
            label="Emas, perak & logam mulia"
            value={emas}
            onChange={setEmas}
          />
          <Field
            label="Saham, reksa dana & investasi lain"
            value={investasi}
            onChange={setInvestasi}
          />
          <Field
            label="Piutang yang bisa ditagih"
            value={piutang}
            onChange={setPiutang}
          />
          <Field
            label="Hutang jatuh tempo (pengurang)"
            value={hutang}
            onChange={setHutang}
          />
        </div>
      </div>

      <HasilPanel
        adaInput={adaInput}
        rows={[
          ["Total harta bersih", hartaBersih],
          ["Nisab (85 gr emas)", NISAB_MAAL],
        ]}
        wajib={wajib}
        zakat={zakat}
        pesanBelumWajib="Harta bersih Anda belum mencapai nisab, sehingga belum wajib zakat maal. Anda tetap dapat berinfaq atau bersedekah."
        programSlug={PROGRAM_ZAKAT_MAAL}
      />
    </div>
  );
}
