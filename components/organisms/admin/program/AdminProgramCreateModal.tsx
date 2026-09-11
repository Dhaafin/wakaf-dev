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
  const modalTitle = (
    <div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-200 uppercase tracking-wider mb-1 ring-1 ring-white/15">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        <span>Portofolio Program</span>
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
        Tambah Program Baru
      </h3>
    </div>
  );

  const modalFooter = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={formSubmitting}
        className="btn-outline px-4 py-2.5 text-xs font-semibold disabled:opacity-50"
      >
        Batal
      </button>
      <button
        type="submit"
        form="create-program-form"
        disabled={formSubmitting}
        className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md hover:shadow-lg inline-flex items-center gap-2 disabled:opacity-75 active:scale-95 transition-all"
      >
        {formSubmitting && <Spinner className="h-3.5 w-3.5 text-brand-950" />}
        <span>{formSubmitting ? "Menyimpan ke Sistem..." : "Simpan & Terbitkan"}</span>
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      description="Lengkapi rincian kampanye berikut untuk menerbitkan program baru ke portal publik Yayasan KBM."
      footer={modalFooter}
      maxWidth="3xl"
      headerVariant="brand"
      preventBackdropClose={formSubmitting}
    >
      <form id="create-program-form" onSubmit={onSubmit} className="space-y-6">
        {/* =================================================================== */}
        {/* SEKSI 1: IDENTITAS & KLASIFIKASI                                    */}
        {/* =================================================================== */}
        <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-200/70 text-[10px] text-brand-800">
              1
            </span>
            <span>Identitas & Klasifikasi Program</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nama Program */}
            <div className="sm:col-span-2">
              <label className="label">
                Nama Program <span className="text-red-500">*</span>
              </label>
              <input
                value={formNama}
                onChange={(e) => onNamaChange(e.target.value)}
                disabled={formSubmitting}
                className={`input ${formErrors.nama ? "input-error" : ""}`}
                placeholder="mis. Pembangunan Sumur Wakaf Dusun Berkah"
              />
              {formErrors.nama && <p className="field-error">{formErrors.nama}</p>}
            </div>

            {/* Jenis Program */}
            <div>
              <label className="label">
                Jenis Instrumen <span className="text-red-500">*</span>
              </label>
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

            {/* Kategori */}
            <div>
              <label className="label">
                Kategori Peruntukan <span className="text-red-500">*</span>
              </label>
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
          </div>
        </div>

        {/* =================================================================== */}
        {/* SEKSI 2: TARGET FINANSIAL & LEMBAGA                                  */}
        {/* =================================================================== */}
        <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-200/70 text-[10px] text-brand-800">
              2
            </span>
            <span>Target Finansial & Wilayah</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Target Dana */}
            <div>
              <label className="label">
                Target Penghimpunan <span className="text-red-500">*</span>
              </label>
              <RupiahInput
                value={formTarget}
                onChange={onTargetChange}
                invalid={Boolean(formErrors.target)}
              />
              {formErrors.target && <p className="field-error">{formErrors.target}</p>}
            </div>

            {/* Lokasi */}
            <div>
              <label className="label">
                Lokasi Wilayah <span className="text-red-500">*</span>
              </label>
              <input
                value={formLokasi}
                onChange={(e) => onLokasiChange(e.target.value)}
                disabled={formSubmitting}
                className={`input ${formErrors.lokasi ? "input-error" : ""}`}
                placeholder="Kota / Kabupaten, Provinsi"
              />
              {formErrors.lokasi && <p className="field-error">{formErrors.lokasi}</p>}
            </div>

            {/* Nazhir */}
            <div className="sm:col-span-2">
              <label className="label">
                Nazhir / Lembaga Pengelola <span className="text-red-500">*</span>
              </label>
              <input
                value={formNazhir}
                onChange={(e) => onNazhirChange(e.target.value)}
                disabled={formSubmitting}
                className={`input ${formErrors.nazhir ? "input-error" : ""}`}
              />
              {formErrors.nazhir && <p className="field-error">{formErrors.nazhir}</p>}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SEKSI 3: KONTEN & MEDIA DOKUMENTASI                                 */}
        {/* =================================================================== */}
        <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-200/70 text-[10px] text-brand-800">
              3
            </span>
            <span>Narasi & Dokumentasi Visual</span>
          </div>

          <div className="space-y-4">
            {/* Ringkasan */}
            <div>
              <label className="label">
                Ringkasan Singkat <span className="text-red-500">*</span>
              </label>
              <input
                value={formRingkasan}
                onChange={(e) => onRingkasanChange(e.target.value)}
                disabled={formSubmitting}
                className={`input ${formErrors.ringkasan ? "input-error" : ""}`}
                placeholder="Ringkasan 1-2 kalimat untuk kartu program..."
              />
              {formErrors.ringkasan && <p className="field-error">{formErrors.ringkasan}</p>}
            </div>

            {/* Deskripsi Lengkap */}
            <div>
              <label className="label">
                Deskripsi Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formDeskripsi}
                onChange={(e) => onDeskripsiChange(e.target.value)}
                disabled={formSubmitting}
                className={`input resize-none ${formErrors.deskripsi ? "input-error" : ""}`}
                placeholder="Jelaskan urgensi, target penerima manfaat, dan rencana penyaluran dana..."
              />
              {formErrors.deskripsi && <p className="field-error">{formErrors.deskripsi}</p>}
            </div>

            {/* Gambar Sampul */}
            <div>
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
                Bila dikosongkan, kartu otomatis memakai ilustrasi bawaan sesuai kategori program.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
