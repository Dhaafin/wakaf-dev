"use client";

import { useState } from "react";
import { PROGRAM_TYPE_TERMS, type Program } from "@/types";
import { api, ApiError } from "@/lib/api/client";
import { validateWakafForm } from "@/lib/validation";
import { formatRupiah } from "@/lib/format";
import { NOMINAL_PRESETS, NOMINAL_MIN, BANK_OPTIONS } from "@/lib/config";
import { RupiahInput } from "@/components/molecules/RupiahInput";
import { Spinner } from "@/components/atoms/Spinner";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/lib/store/toast";

type Errors = Record<string, string>;

export function WakafForm({
  program,
  onCreated,
  nominalAwal,
}: {
  program: Program;
  onCreated: (txId: string) => void;
  /** Nominal awal terisi — dipakai saat datang dari kalkulator zakat. */
  nominalAwal?: number;
}) {
  // Istilah menyesuaikan jenis program (wakaf / infaq / zakat).
  const terms = PROGRAM_TYPE_TERMS[program.program_type];
  const wakif = useSession((s) => s.wakif);
  const { push } = useToast();

  const [nominal, setNominal] = useState<number | "">(nominalAwal ?? "");
  const [nama, setNama] = useState(wakif?.nama ?? "");
  const [email, setEmail] = useState(wakif?.email ?? "");
  const [telepon, setTelepon] = useState("");
  const [atasNama, setAtasNama] = useState<"sendiri" | "orang-lain">("sendiri");
  const [namaAtasNama, setNamaAtasNama] = useState("");
  const [visibilitas, setVisibilitas] = useState<"publik" | "anonim">("publik");
  const [doa, setDoa] = useState("");
  const [bank, setBank] = useState<string>(BANK_OPTIONS[0]);

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function fieldProps(name: string) {
    return {
      className: `input ${errors[name] ? "input-error" : ""}`,
      "aria-invalid": Boolean(errors[name]),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const values = {
      nominal,
      nama,
      email,
      telepon,
      atasNama,
      namaAtasNama,
      visibilitas,
      doa,
      bank,
    };
    const localErrors = validateWakafForm(values);
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) {
      push({
        kind: "error",
        title: "Form belum lengkap",
        desc: "Periksa kembali kolom yang ditandai merah.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const tx = await api.createTransaction({
        programId: program.id,
        nominal: Number(nominal),
        nama: nama.trim(),
        email: email.trim(),
        telepon: telepon.trim(),
        atasNama,
        namaAtasNama: atasNama === "orang-lain" ? namaAtasNama.trim() : undefined,
        visibilitas,
        doa: doa.trim() || undefined,
        bank,
      });
      push({
        kind: "success",
        title: `Tagihan ${terms.judulForm.toLowerCase().replace(/^(tunaikan|salurkan) /, "")} dibuat`,
        desc: `Nomor VA ${tx.vaNumber} telah diterbitkan.`,
      });
      onCreated(tx.id);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setErrors(err.fieldErrors);
      }
      push({
        kind: "error",
        title: "Gagal membuat tagihan",
        desc: err instanceof Error ? err.message : undefined,
      });
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card p-6"
      aria-label={`Formulir ${terms.judulForm}`}
    >
      <h2 className="font-serif text-xl font-bold text-brand-950">
        {terms.judulForm}
      </h2>
      <p className="mt-1 text-sm text-brand-500">
        untuk <span className="font-medium text-brand-700">{program.nama}</span>
      </p>

      {/* Nominal */}
      <div className="mt-5">
        <label htmlFor="nominal" className="label">
          Nominal {terms.judulForm.split(" ").slice(1).join(" ")}
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {NOMINAL_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setNominal(p)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                nominal === p
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-brand-200 bg-white text-brand-700 hover:border-brand-400"
              }`}
            >
              {formatRupiah(p)}
            </button>
          ))}
        </div>
        <RupiahInput
          id="nominal"
          value={nominal}
          onChange={setNominal}
          invalid={Boolean(errors.nominal)}
        />
        {errors.nominal ? (
          <p className="field-error">{errors.nominal}</p>
        ) : (
          <p className="mt-1 text-xs text-brand-400">
            Minimum {formatRupiah(NOMINAL_MIN)}.
          </p>
        )}
      </div>

      {/* Atas nama */}
      <fieldset className="mt-5">
        <legend className="label">Atas nama</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["sendiri", "Diri sendiri"],
              ["orang-lain", "Orang lain"],
            ] as const
          ).map(([val, lbl]) => (
            <button
              key={val}
              type="button"
              onClick={() => setAtasNama(val)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                atasNama === val
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-brand-200 text-brand-600 hover:border-brand-400"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
        {atasNama === "orang-lain" && (
          <div className="mt-3 animate-fade-in">
            <label htmlFor="namaAtasNama" className="label">
              Nama pihak yang diwakafkan
            </label>
            <input
              id="namaAtasNama"
              value={namaAtasNama}
              onChange={(e) => setNamaAtasNama(e.target.value)}
              placeholder="mis. Almh. Hj. Rukmini"
              {...fieldProps("namaAtasNama")}
            />
            {errors.namaAtasNama && (
              <p className="field-error">{errors.namaAtasNama}</p>
            )}
          </div>
        )}
      </fieldset>

      {/* Data diri */}
      <div className="mt-5 space-y-3">
        <div>
          <label htmlFor="nama" className="label">
            Nama lengkap
          </label>
          <input
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Anda"
            autoComplete="name"
            {...fieldProps("nama")}
          />
          {errors.nama && <p className="field-error">{errors.nama}</p>}
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@contoh.com"
            autoComplete="email"
            {...fieldProps("email")}
          />
          {errors.email ? (
            <p className="field-error">{errors.email}</p>
          ) : (
            <p className="mt-1 text-xs text-brand-400">
              Sertifikat &amp; riwayat wakaf dikirim ke email ini.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="telepon" className="label">
            Nomor HP
          </label>
          <input
            id="telepon"
            inputMode="numeric"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            placeholder="081234567890"
            autoComplete="tel"
            {...fieldProps("telepon")}
          />
          {errors.telepon && <p className="field-error">{errors.telepon}</p>}
        </div>
      </div>

      {/* Visibilitas */}
      <fieldset className="mt-5">
        <legend className="label">Tampilkan nama sebagai</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["publik", "Publik"],
              ["anonim", "Anonim"],
            ] as const
          ).map(([val, lbl]) => (
            <button
              key={val}
              type="button"
              onClick={() => setVisibilitas(val)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                visibilitas === val
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-brand-200 text-brand-600 hover:border-brand-400"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Doa */}
      <div className="mt-5">
        <label htmlFor="doa" className="label">
          Doa / pesan <span className="text-brand-400">(opsional)</span>
        </label>
        <textarea
          id="doa"
          value={doa}
          onChange={(e) => setDoa(e.target.value)}
          rows={2}
          className="input resize-none"
          placeholder="Semoga menjadi amal jariyah…"
        />
      </div>

      {/* Bank VA */}
      <div className="mt-5">
        <label htmlFor="bank" className="label">
          Bank Virtual Account
        </label>
        <select
          id="bank"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="input"
        >
          {BANK_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Ringkasan */}
      <div className="mt-5 rounded-xl bg-brand-50 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-brand-600">Nominal</span>
          <span className="font-semibold text-brand-900">
            {nominal ? formatRupiah(Number(nominal)) : "—"}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-brand-600">Biaya admin</span>
          <span className="font-semibold text-brand-900">Rp0</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-brand-200 pt-2">
          <span className="font-semibold text-brand-800">Total bayar</span>
          <span className="font-serif text-lg font-bold text-brand-900">
            {nominal ? formatRupiah(Number(nominal)) : "—"}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-5 w-full"
      >
        {submitting && <Spinner className="h-4 w-4" />}
        {submitting ? "Menerbitkan tagihan…" : "Lanjut ke pembayaran"}
      </button>
      <p className="mt-2 text-center text-xs text-brand-400">
        {program.program_type === "zakat"
          ? "Dengan melanjutkan, Anda menyatakan menunaikan zakat melalui amil KBM."
          : program.program_type === "infaq-shadaqah"
            ? "Dengan melanjutkan, dana Anda akan disalurkan sesuai peruntukan program."
            : "Dengan melanjutkan, Anda menyetujui akad wakaf yang berlaku."}
      </p>
    </form>
  );
}
