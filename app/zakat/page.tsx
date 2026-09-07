"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RupiahInput } from "@/components/rupiah-input";
import { formatRupiah } from "@/lib/format";
import {
  NISAB_EMAS_GRAM,
  HARGA_EMAS_PER_GRAM,
  KADAR_ZAKAT,
  PROGRAM_ZAKAT_MAAL,
  PROGRAM_ZAKAT_PENGHASILAN,
} from "@/lib/config";

// ============================================================================
// Kalkulator Zakat — menghitung zakat maal & zakat penghasilan.
// Hasil hitungannya diteruskan ke form pembayaran lewat query ?nominal=
// sehingga nominal langsung terisi (lihat components/program-detail.tsx).
//
// CATATAN DEMO: harga emas di-hardcode di lib/config.ts. Untuk produksi ambil
// dari sumber harga real-time atau setelan admin.
// ============================================================================

type Tab = "maal" | "penghasilan";

const NISAB_MAAL = NISAB_EMAS_GRAM * HARGA_EMAS_PER_GRAM;

export default function ZakatPage() {
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

      {/* Tab — memakai pola tab yang sama dengan panel admin */}
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

// ---------------------------------------------------------------------------

function KalkulatorMaal() {
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

// ---------------------------------------------------------------------------

function KalkulatorPenghasilan() {
  const [gaji, setGaji] = useState<number | "">("");
  const [lain, setLain] = useState<number | "">("");
  const [kebutuhan, setKebutuhan] = useState<number | "">("");

  const netoBulanan = useMemo(() => {
    const n = (v: number | "") => (v === "" ? 0 : v);
    return Math.max(0, n(gaji) + n(lain) - n(kebutuhan));
  }, [gaji, lain, kebutuhan]);

  // Nisab zakat penghasilan disetarakan 85 gr emas per TAHUN.
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

// ---------------------------------------------------------------------------

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

function HasilPanel({
  adaInput,
  rows,
  wajib,
  zakat,
  satuan = "",
  pesanBelumWajib,
  programSlug,
}: {
  adaInput: boolean;
  rows: [string, number][];
  wajib: boolean;
  zakat: number;
  satuan?: string;
  pesanBelumWajib: string;
  programSlug: string;
}) {
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="card p-6">
        <h2 className="font-serif text-lg font-bold text-brand-950">
          Hasil perhitungan
        </h2>

        <dl className="mt-4 space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-4 border-b border-brand-50 pb-2"
            >
              <dt className="text-brand-500">{k}</dt>
              <dd className="font-semibold text-brand-900">{formatRupiah(v)}</dd>
            </div>
          ))}
        </dl>

        {!adaInput ? (
          <p className="mt-5 text-sm text-brand-500">
            Isi kolom di samping untuk melihat hasil perhitungan.
          </p>
        ) : wajib ? (
          <>
            <div className="mt-5 rounded-xl bg-brand-50 p-4 text-center">
              <p className="text-xs text-brand-600">
                Zakat yang perlu ditunaikan
              </p>
              <p className="mt-1 font-serif text-2xl font-bold text-brand-800">
                {formatRupiah(zakat)}
                <span className="text-sm font-normal text-brand-500">
                  {satuan}
                </span>
              </p>
            </div>
            <Link
              href={`/program/${programSlug}?nominal=${zakat}`}
              className="btn-primary mt-4 w-full"
            >
              Tunaikan zakat sekarang
            </Link>
            <p className="mt-2 text-center text-xs text-brand-400">
              Nominal akan otomatis terisi pada form pembayaran.
            </p>
          </>
        ) : (
          <>
            <div className="mt-5 rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-800">{pesanBelumWajib}</p>
            </div>
            <Link
              href="/program#infaq-shadaqah"
              className="btn-outline mt-4 w-full"
            >
              Lihat program infaq &amp; shadaqah
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
