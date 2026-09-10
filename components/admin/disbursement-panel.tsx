"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/types";
import { api, ApiError } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { validateDisbursementForm } from "@/lib/validation";
import { RupiahInput } from "@/components/molecules/RupiahInput";
import { MockFileInput } from "@/components/mock-file-input";
import { Spinner } from "@/components/atoms/Spinner";
import { useToast } from "@/lib/store/toast";

// Update status penyaluran dana per program + unggah bukti (mock file upload).
export function DisbursementPanel() {
  const { data: programs, loading, refetch } = useAsync(
    () => api.listPrograms(),
    [],
  );
  const { push } = useToast();

  const [programId, setProgramId] = useState<string>("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [nominal, setNominal] = useState<number | "">("");
  const [buktiImageUrl, setBuktiImageUrl] = useState("");
  const [buktiFileName, setBuktiFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const selected: Program | undefined = useMemo(
    () => (programs?.items ?? []).find((p) => p.id === programId),
    [programs, programId],
  );

  function reset() {
    setJudul("");
    setDeskripsi("");
    setNominal("");
    setBuktiImageUrl("");
    setBuktiFileName("");
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!programId) {
      setErrors({ programId: "Pilih program terlebih dahulu." });
      return;
    }
    const values = { judul, deskripsi, nominal, buktiImageUrl, buktiFileName };
    const localErrors = validateDisbursementForm(values);
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) return;

    setSubmitting(true);
    try {
      await api.addDisbursement(programId, {
        judul: judul.trim(),
        deskripsi: deskripsi.trim(),
        nominal: Number(nominal),
        buktiImageUrl,
        buktiFileName: buktiFileName || undefined,
      });
      push({
        kind: "success",
        title: "Laporan penyaluran tersimpan",
        desc: "Halaman Transparansi & detail program ikut diperbarui.",
      });
      reset();
      refetch();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      push({ kind: "error", title: "Gagal menyimpan laporan" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-brand-200 bg-white p-6"
      >
        <h3 className="font-serif text-lg font-bold text-brand-950">
          Catat penyaluran dana
        </h3>

        <div className="mt-4 space-y-4">
          <div>
            <label className="label">Program</label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className={`input ${errors.programId ? "input-error" : ""}`}
              disabled={loading}
            >
              <option value="">— pilih program —</option>
              {(programs?.items ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
            {errors.programId && (
              <p className="field-error">{errors.programId}</p>
            )}
          </div>

          {selected && (
            <div className="rounded-xl bg-brand-50 p-3 text-xs text-brand-600">
              Terkumpul {formatRupiah(selected.terkumpul)} · sudah disalurkan{" "}
              {formatRupiah(
                selected.disbursements.reduce((s, d) => s + d.nominal, 0),
              )}
            </div>
          )}

          <div>
            <label className="label">Judul penyaluran</label>
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className={`input ${errors.judul ? "input-error" : ""}`}
              placeholder="mis. Pembelian material tahap 2"
            />
            {errors.judul && <p className="field-error">{errors.judul}</p>}
          </div>

          <div>
            <label className="label">Deskripsi / rincian</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className={`input resize-none ${
                errors.deskripsi ? "input-error" : ""
              }`}
            />
            {errors.deskripsi && (
              <p className="field-error">{errors.deskripsi}</p>
            )}
          </div>

          <div>
            <label className="label">Nominal disalurkan</label>
            <RupiahInput
              value={nominal}
              onChange={setNominal}
              invalid={Boolean(errors.nominal)}
            />
            {errors.nominal && <p className="field-error">{errors.nominal}</p>}
          </div>

          <div>
            <label className="label">Bukti penyaluran (gambar)</label>
            <MockFileInput
              value={buktiImageUrl}
              fileName={buktiFileName}
              invalid={Boolean(errors.buktiImageUrl)}
              onChange={(url, name) => {
                setBuktiImageUrl(url);
                setBuktiFileName(name);
              }}
            />
            {errors.buktiImageUrl && (
              <p className="field-error">{errors.buktiImageUrl}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting && <Spinner className="h-4 w-4" />}
            Simpan laporan penyaluran
          </button>
        </div>
      </form>

      {/* Riwayat penyaluran program terpilih */}
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-950">
          Riwayat penyaluran
          {selected ? ` — ${selected.nama}` : ""}
        </h3>
        {!selected ? (
          <p className="mt-3 text-sm text-brand-500">
            Pilih program untuk melihat riwayat penyalurannya.
          </p>
        ) : selected.disbursements.length === 0 ? (
          <p className="mt-3 text-sm text-brand-500">
            Belum ada penyaluran untuk program ini.
          </p>
        ) : (
          <ol className="mt-3 space-y-3">
            {selected.disbursements.map((d) => (
              <li
                key={d.id}
                className="rounded-2xl border border-brand-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-brand-900">{d.judul}</p>
                    <p className="text-xs text-brand-400">
                      {formatTanggal(d.tanggal)}
                    </p>
                  </div>
                  <span className="badge bg-brand-100 text-brand-800">
                    {formatRupiah(d.nominal)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-brand-600">{d.deskripsi}</p>
                {d.buktiImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.buktiImageUrl}
                    alt={`Bukti ${d.judul}`}
                    className="mt-3 max-h-44 w-full rounded-xl object-cover"
                  />
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
