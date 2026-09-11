import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  type ProgramCategory,
  type ProgramType,
} from "@/types";
import { Modal } from "@/components/molecules/Modal";
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Program Baru"
      description="Daftarkan instrumen wakaf, infaq, atau zakat baru ke dalam sistem Yayasan KBM."
      maxWidth="2xl"
      preventBackdropClose={formSubmitting}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 1. Nama Program */}
          <div className="sm:col-span-2">
            <label className="label">Nama Program *</label>
            <input
              value={formNama}
              onChange={(e) => onNamaChange(e.target.value)}
              disabled={formSubmitting}
              className={`input ${formErrors.nama ? "input-error" : ""}`}
              placeholder="mis. Pembangunan Sumur Wakaf Dusun Berkah"
            />
            {formErrors.nama && <p className="field-error">{formErrors.nama}</p>}
          </div>

          {/* 2. Jenis Program */}
          <div>
            <label className="label">Jenis Program *</label>
            <select
              value={formType}
              onChange={(e) => onTypeChange(e.target.value as ProgramType)}
              disabled={formSubmitting}
              className="input"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {PROGRAM_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Kategori */}
          <div>
            <label className="label">Kategori *</label>
            <select
              value={formKategori}
              onChange={(e) => onKategoriChange(e.target.value as ProgramCategory)}
              disabled={formSubmitting}
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

          {/* 4. Lokasi */}
          <div>
            <label className="label">Lokasi Wilayah *</label>
            <input
              value={formLokasi}
              onChange={(e) => onLokasiChange(e.target.value)}
              disabled={formSubmitting}
              className={`input ${formErrors.lokasi ? "input-error" : ""}`}
              placeholder="Kota / Kabupaten, Provinsi"
            />
            {formErrors.lokasi && <p className="field-error">{formErrors.lokasi}</p>}
          </div>

          {/* 5. Target Dana */}
          <div>
            <label className="label">Target Penghimpunan *</label>
            <RupiahInput
              value={formTarget}
              onChange={onTargetChange}
              invalid={Boolean(formErrors.target)}
            />
            {formErrors.target && <p className="field-error">{formErrors.target}</p>}
          </div>

          {/* 6. Ringkasan */}
          <div className="sm:col-span-2">
            <label className="label">Ringkasan Singkat *</label>
            <input
              value={formRingkasan}
              onChange={(e) => onRingkasanChange(e.target.value)}
              disabled={formSubmitting}
              className={`input ${formErrors.ringkasan ? "input-error" : ""}`}
              placeholder="Ringkasan 1-2 kalimat untuk kartu program..."
            />
            {formErrors.ringkasan && <p className="field-error">{formErrors.ringkasan}</p>}
          </div>

          {/* 7. Deskripsi Lengkap */}
          <div className="sm:col-span-2">
            <label className="label">Deskripsi Lengkap *</label>
            <textarea
              rows={4}
              value={formDeskripsi}
              onChange={(e) => onDeskripsiChange(e.target.value)}
              disabled={formSubmitting}
              className={`input resize-none ${formErrors.deskripsi ? "input-error" : ""}`}
              placeholder="Jelaskan urgensi, manfaat, dan rincian penyaluran dana..."
            />
            {formErrors.deskripsi && <p className="field-error">{formErrors.deskripsi}</p>}
          </div>

          {/* 8. Gambar Sampul */}
          <div className="sm:col-span-2">
            <label className="label">
              URL Gambar Sampul <span className="text-brand-400 font-normal">(opsional)</span>
            </label>
            <input
              value={formImageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              disabled={formSubmitting}
              className="input"
              placeholder="https://images.unsplash.com/..."
            />
            <p className="mt-1 text-[11px] text-brand-400">
              Bila dikosongkan, program otomatis memakai ilustrasi bawaan sesuai kategori.
            </p>
          </div>

          {/* 9. Nazhir */}
          <div className="sm:col-span-2">
            <label className="label">Nazhir / Lembaga Pengelola *</label>
            <input
              value={formNazhir}
              onChange={(e) => onNazhirChange(e.target.value)}
              disabled={formSubmitting}
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
            disabled={formSubmitting}
            className="btn-outline px-4 py-2 text-xs disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={formSubmitting}
            className="btn-primary px-5 py-2 text-xs font-semibold shadow-sm inline-flex items-center gap-2 disabled:opacity-75"
          >
            {formSubmitting && <Spinner className="h-3.5 w-3.5 text-brand-950" />}
            <span>{formSubmitting ? "Menyimpan ke Sistem..." : "Simpan & Terbitkan"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
