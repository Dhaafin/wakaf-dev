"use client";

import { useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import { useAsync } from "@/lib/hooks/use-async";
import { formatRupiah, persen } from "@/lib/format";
import { validateProgramForm } from "@/lib/validation";
import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  type ProgramCategory,
  type ProgramType,
} from "@/types";
import { RupiahInput } from "@/components/rupiah-input";
import { Spinner } from "@/components/atoms/Spinner";
import { useToast } from "@/lib/store/toast";

const CATEGORIES = Object.keys(PROGRAM_CATEGORY_LABEL) as ProgramCategory[];
const TYPES = Object.keys(PROGRAM_TYPE_LABEL) as ProgramType[];

export function ProgramsPanel() {
  const { data, loading, error, refetch } = useAsync(
    () => api.listPrograms(),
    [],
  );
  const { push } = useToast();
  const [showForm, setShowForm] = useState(false);

  // --- form state ---
  const [nama, setNama] = useState("");
  const [programType, setProgramType] = useState<ProgramType>("wakaf-melalui-uang");
  const [kategori, setKategori] = useState<ProgramCategory>("masjid");
  const [lokasi, setLokasi] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [target, setTarget] = useState<number | "">("");
  const [nazhir, setNazhir] = useState("Nazhir Yayasan Khazanah Berkah Mulia");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setNama("");
    setProgramType("wakaf-melalui-uang");
    setKategori("masjid");
    setLokasi("");
    setRingkasan("");
    setDeskripsi("");
    setImageUrl("");
    setTarget("");
    setErrors({});
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const values = {
      nama,
      kategori,
      lokasi,
      ringkasan,
      deskripsi,
      imageUrl,
      target,
      nazhir,
    };
    const localErrors = validateProgramForm(values);
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) return;

    setSubmitting(true);
    try {
      const prog = await api.createProgram({
        nama: nama.trim(),
        program_type: programType,
        kategori,
        lokasi: lokasi.trim(),
        ringkasan: ringkasan.trim(),
        deskripsi: deskripsi.trim(),
        imageUrl: imageUrl.trim() || undefined,
        target: Number(target),
        nazhir: nazhir.trim(),
      });
      push({
        kind: "success",
        title: "Program dibuat",
        desc: `"${prog.nama}" kini tampil di listing publik.`,
      });
      resetForm();
      setShowForm(false);
      refetch();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      push({ kind: "error", title: "Gagal membuat program" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-600">
          {data?.length ?? 0} program terdaftar
        </p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-primary text-xs"
        >
          {showForm ? "Tutup form" : "+ Tambah program"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-4 animate-fade-in rounded-2xl border border-brand-200 bg-white p-6"
        >
          <h3 className="font-serif text-lg font-bold text-brand-950">
            Program baru
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Nama program</label>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className={`input ${errors.nama ? "input-error" : ""}`}
                placeholder="mis. Pembangunan Masjid Al-Hikmah"
              />
              {errors.nama && <p className="field-error">{errors.nama}</p>}
            </div>

            <div>
              <label className="label">Jenis program</label>
              {/* Modular: field program_type untuk zakat/donasi/qurban di masa depan */}
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value as ProgramType)}
                className="input"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PROGRAM_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Kategori</label>
              <select
                value={kategori}
                onChange={(e) =>
                  setKategori(e.target.value as ProgramCategory)
                }
                className={`input ${errors.kategori ? "input-error" : ""}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {PROGRAM_CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Lokasi</label>
              <input
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className={`input ${errors.lokasi ? "input-error" : ""}`}
                placeholder="Kota, Provinsi"
              />
              {errors.lokasi && <p className="field-error">{errors.lokasi}</p>}
            </div>

            <div>
              <label className="label">Target dana</label>
              <RupiahInput
                value={target}
                onChange={setTarget}
                invalid={Boolean(errors.target)}
              />
              {errors.target && <p className="field-error">{errors.target}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Ringkasan (1–2 kalimat)</label>
              <input
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                className={`input ${errors.ringkasan ? "input-error" : ""}`}
              />
              {errors.ringkasan && (
                <p className="field-error">{errors.ringkasan}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Deskripsi lengkap</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={4}
                className={`input resize-none ${
                  errors.deskripsi ? "input-error" : ""
                }`}
              />
              {errors.deskripsi && (
                <p className="field-error">{errors.deskripsi}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="label">
                URL gambar <span className="text-brand-400">(opsional)</span>
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input"
                placeholder="https://… (foto dokumentasi program)"
              />
              <p className="mt-1 text-xs text-brand-400">
                Kosongkan untuk memakai ilustrasi bawaan sesuai kategori.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="label">Nazhir / pengelola</label>
              <input
                value={nazhir}
                onChange={(e) => setNazhir(e.target.value)}
                className={`input ${errors.nazhir ? "input-error" : ""}`}
              />
              {errors.nazhir && <p className="field-error">{errors.nazhir}</p>}
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting && <Spinner className="h-4 w-4" />}
              Simpan program
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="btn-outline"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          [0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-24 w-full rounded-2xl" />
          ))
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          (data ?? []).map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="badge bg-brand-100 text-brand-700">
                    {PROGRAM_TYPE_LABEL[p.program_type]}
                  </span>
                  <span className="text-xs text-brand-400">
                    {PROGRAM_CATEGORY_LABEL[p.kategori]}
                  </span>
                </div>
                <p className="mt-1 truncate font-semibold text-brand-950">
                  {p.nama}
                </p>
                <p className="text-xs text-brand-500">
                  {formatRupiah(p.terkumpul)} / {formatRupiah(p.target)} ·{" "}
                  {persen(p.terkumpul, p.target)}% · {p.jumlahWakif} wakif
                </p>
              </div>
              <Link
                href={`/program/${p.slug}`}
                className="btn-outline px-3 py-2 text-xs"
              >
                Lihat di publik ↗
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
