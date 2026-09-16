"use client";

import { useState } from "react";
import { KalkulatorMaal } from "./molecules/KalkulatorMaal";
import { KalkulatorPenghasilan } from "./molecules/KalkulatorPenghasilan";
import { NISAB_EMAS_GRAM, HARGA_EMAS_PER_GRAM } from "@/lib/config";
import { formatRupiah } from "@/lib/format";

type Tab = "maal" | "penghasilan";

export function ZakatCalculatorOrganism() {
  const [tab, setTab] = useState<Tab>("maal");

  return (
    <div className="container-app max-w-3xl py-10">
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-brand-950 sm:text-4xl">
          Kalkulator Zakat
        </h1>
        <p className="mt-2 text-brand-600">
          Hitung kewajiban zakat Anda, lalu tunaikan langsung. Kadar zakat 2,5%
          dengan nisab setara {NISAB_EMAS_GRAM} gram emas.
        </p>
      </header>

      {/* Tab navigation */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-brand-200">
        {(
          [
            ["maal", "Zakat Maal (Harta)"],
            ["penghasilan", "Zakat Penghasilan"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === id
                ? "border-brand-600 text-brand-900"
                : "border-transparent text-brand-500 hover:text-brand-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "maal" ? <KalkulatorMaal /> : <KalkulatorPenghasilan />}
      </div>

      <div className="card mt-8 p-5 text-xs text-brand-500">
        <p className="font-semibold text-brand-700">Catatan perhitungan</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            Nisab memakai patokan {NISAB_EMAS_GRAM} gram emas. Harga emas yang
            dipakai demo ini {formatRupiah(HARGA_EMAS_PER_GRAM)}/gram — di
            produksi diambil dari harga pasar terkini.
          </li>
          <li>Kadar zakat maal &amp; penghasilan sebesar 2,5%.</li>
          <li>
            Zakat maal wajib bila harta bersih mencapai nisab dan telah dimiliki
            selama satu haul (satu tahun hijriah).
          </li>
          <li>
            Hasil kalkulator bersifat perkiraan. Untuk kasus khusus, silakan
            konsultasikan dengan amil.
          </li>
        </ul>
      </div>
    </div>
  );
}
