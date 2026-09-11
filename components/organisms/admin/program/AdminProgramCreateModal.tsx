import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  type ProgramCategory,
  type ProgramType,
} from "@/types";
import { Spinner } from "@/components/atoms/Spinner";
import { RupiahInput } from "@/components/molecules/RupiahInput";

const CATEGORIES = Object.keys(PROGRAM_CATEGORY_LABEL) as ProgramCategory[];
const TYPES = Object.keys(PROGRAM_TYPE_LABEL) as ProgramType[];

export interface AdminProgramCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  formNama: string;
  onNamaChange: (val: string) => void;
  formType: ProgramType;
  onTypeChange: (val: ProgramType) => void;
  formKategori: ProgramCategory;
  onKategoriChange: (val: ProgramCategory) => void;
  formLokasi: string;
  onLokasiChange: (val: string) => void;
  formRingkasan: string;
  onRingkasanChange: (val: string) => void;
  formDeskripsi: string;
  onDeskripsiChange: (val: string) => void;
  formImageUrl: string;
  onImageUrlChange: (val: string) => void;
  formTarget: number | "";
  onTargetChange: (val: number | "") => void;
  formNazhir: string;
  onNazhirChange: (val: string) => void;
  formErrors: Record<string, string>;
  formSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminProgramCreateModal({
  isOpen,
  onClose,
  formNama,
  onNamaChange,
  formType,
  onTypeChange,
  formKategori,
  onKategoriChange,
  formLokasi,
  onLokasiChange,
  formRingkasan,
  onRingkasanChange,
  formDeskripsi,
  onDeskripsiChange,
  formImageUrl,
  onImageUrlChange,
  formTarget,
  onTargetChange,
  formNazhir,
  onNazhirChange,
  formErrors,
  formSubmitting,
  onSubmit,
}: AdminProgramCreateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-brand-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-brand-100 px-6 py-4 bg-brand-50/40">
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-950">
              Tambah Program Baru
            </h3>
            <p className="text-xs text-brand-500">
              Daftarkan instrumen wakaf, infaq, atau zakat baru ke dalam sistem Yayasan KBM.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-brand-400 hover:bg-brand-100 hover:text-brand-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Nama Program *</label>
              <input
                value={formNama}
                onChange={(e) => onNamaChange(e.target.value)}
                className={`input ${formErrors.nama ? "input-error" : ""}`}
                placeholder="mis. Pembangunan Sumur Wakaf Dusun Berkah"
              />
              {formErrors.nama && <p className="field-error">{formErrors.nama}</p>}
            </div>

            <div>
              <label className="label">Jenis Program *</label>
              <select
                value={formType}
                onChange={(e) => onTypeChange(e.target.value as ProgramType)}
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
              <label className="label">Kategori *</label>
              <select
                value={formKategori}
                onChange={(e) => onKategoriChange(e.target.value as ProgramCategory)}
                className={`input ${formErrors.kategori ? "input-error" : ""}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {PROGRAM_CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
              {formErrors.kategori && <p className="field-error">{formErrors.kategori}</p>}
            </div>

            <div>
              <label className="label">Lokasi Wilayah *</label>
              <input
                value={formLokasi}
                onChange={(e) => onLokasiChange(e.target.value)}
                className={`input ${formErrors.lokasi ? "input-error" : ""}`}
                placeholder="Kota / Kabupaten, Provinsi"
              />
              {formErrors.lokasi && <p className="field-error">{formErrors.lokasi}</p>}
            </div>

            <div>
              <label className="label">Target Penghimpunan *</label>
              <RupiahInput
                value={formTarget}
                onChange={onTargetChange}
                invalid={Boolean(formErrors.target)}
              />
              {formErrors.target && <p className="field-error">{formErrors.target}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Ringkasan Singkat *</label>
              <input
                value={formRingkasan}
                onChange={(e) => onRingkasanChange(e.target.value)}
                className={`input ${formErrors.ringkasan ? "input-error" : ""}`}
                placeholder="Ringkasan 1-2 kalimat untuk kartu program..."
              />
              {formErrors.ringkasan && <p className="field-error">{formErrors.ringkasan}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Deskripsi Lengkap *</label>
              <textarea
                rows={4}
                value={formDeskripsi}
                onChange={(e) => onDeskripsiChange(e.target.value)}
                className={`input resize-none ${formErrors.deskripsi ? "input-error" : ""}`}
                placeholder="Jelaskan urgensi, manfaat, dan rincian penyaluran dana..."
              />
              {formErrors.deskripsi && <p className="field-error">{formErrors.deskripsi}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="label">
                URL Gambar Sampul <span className="text-brand-400 font-normal">(opsional)</span>
              </label>
              <input
                value={formImageUrl}
                onChange={(e) => onImageUrlChange(e.target.value)}
                className="input"
                placeholder="https://images.unsplash.com/..."
              />
              <p className="mt-1 text-[11px] text-brand-400">
                Bila dikosongkan, program otomatis memakai ilustrasi bawaan sesuai kategori.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="label">Nazhir / Lembaga Pengelola *</label>
              <input
                value={formNazhir}
                onChange={(e) => onNazhirChange(e.target.value)}
                className={`input ${formErrors.nazhir ? "input-error" : ""}`}
              />
              {formErrors.nazhir && <p className="field-error">{formErrors.nazhir}</p>}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-brand-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline px-4 py-2 text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="btn-primary px-5 py-2 text-xs font-semibold shadow-sm"
            >
              {formSubmitting && <Spinner className="h-3.5 w-3.5" />}
              <span>Simpan & Terbitkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
