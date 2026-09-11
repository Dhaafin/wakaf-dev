import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  type ProgramCategory,
  type ProgramType,
} from "@/types";
import { Modal } from "@/components/molecules/Modal";
import { Spinner } from "@/components/atoms/Spinner";
import { RupiahInput } from "@/components/molecules/RupiahInput";
import { TextInput } from "@/components/molecules/TextInput";
import { Combobox } from "@/components/molecules/Combobox";

const CATEGORIES = Object.keys(PROGRAM_CATEGORY_LABEL) as ProgramCategory[];
const TYPES = Object.keys(PROGRAM_TYPE_LABEL) as ProgramType[];

export interface AdminProgramCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  formNama: string;
  onNamaChange: (val: string) => void;
  formType: string;
  onTypeChange: (val: string) => void;
  formKategori: string;
  onKategoriChange: (val: string) => void;
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
  mode = "create",
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
  const isEdit = mode === "edit";

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
        <span>
          {formSubmitting
            ? isEdit
              ? "Menyimpan Perubahan..."
              : "Menyimpan ke Sistem..."
            : isEdit
              ? "Simpan Perubahan"
              : "Simpan & Terbitkan"}
        </span>
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Ubah Data Program" : "Tambah Program Baru"}
      description={
        isEdit
          ? "Perbarui rincian kampanye berikut untuk memperbarui informasi program di portal publik."
          : "Lengkapi rincian kampanye berikut untuk menerbitkan program baru ke portal publik Yayasan KBM."
      }
      footer={modalFooter}
      maxWidth="3xl"
      headerVariant="brand"
      preventBackdropClose={formSubmitting}
    >
      <form id="create-program-form" onSubmit={onSubmit} className="space-y-5">
        {/* =================================================================== */}
        {/* SEKSI 1: IDENTITAS & KLASIFIKASI                                    */}
        {/* =================================================================== */}
        <div className="rounded-2xl bg-brand-50/50 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-200/70 text-[10px] text-brand-800">
              1
            </span>
            <span>Identitas & Klasifikasi Program</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nama Program */}
            <TextInput
              containerClassName="sm:col-span-2"
              label="Nama Program"
              required
              value={formNama}
              onChange={(e) => onNamaChange(e.target.value)}
              disabled={formSubmitting}
              error={formErrors.nama}
              placeholder="mis. Pembangunan Sumur Wakaf Dusun Berkah"
            />

            {/* Jenis Program */}
            <Combobox
              label="Jenis Instrumen"
              required
              value={formType}
              onChange={onTypeChange}
              options={TYPES.map((t) => ({
                value: t,
                label: PROGRAM_TYPE_LABEL[t],
              }))}
              disabled={formSubmitting}
              placeholder="Pilih atau ketik jenis baru..."
              customItemLabel={(q) => (
                <>
                  Gunakan jenis baru:{" "}
                  <strong className="text-brand-950">“{q}”</strong>
                </>
              )}
            />

            {/* Kategori */}
            <Combobox
              label="Kategori Peruntukan"
              required
              value={formKategori}
              onChange={onKategoriChange}
              options={CATEGORIES.map((c) => ({
                value: c,
                label: PROGRAM_CATEGORY_LABEL[c],
              }))}
              disabled={formSubmitting}
              error={formErrors.kategori}
              placeholder="Pilih atau ketik kategori baru..."
              customItemLabel={(q) => (
                <>
                  Gunakan kategori baru:{" "}
                  <strong className="text-brand-950">“{q}”</strong>
                </>
              )}
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* SEKSI 2: TARGET FINANSIAL & LEMBAGA                                  */}
        {/* =================================================================== */}
        <div className="rounded-2xl bg-brand-50/50 p-4 sm:p-5 space-y-4">
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
            <TextInput
              label="Lokasi Wilayah"
              required
              value={formLokasi}
              onChange={(e) => onLokasiChange(e.target.value)}
              disabled={formSubmitting}
              error={formErrors.lokasi}
              placeholder="Kota / Kabupaten, Provinsi"
            />

            {/* Nazhir */}
            <TextInput
              containerClassName="sm:col-span-2"
              label="Nazhir / Lembaga Pengelola"
              required
              value={formNazhir}
              onChange={(e) => onNazhirChange(e.target.value)}
              disabled={formSubmitting}
              error={formErrors.nazhir}
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* SEKSI 3: KONTEN & MEDIA DOKUMENTASI                                 */}
        {/* =================================================================== */}
        <div className="rounded-2xl bg-brand-50/50 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-200/70 text-[10px] text-brand-800">
              3
            </span>
            <span>Narasi & Dokumentasi Visual</span>
          </div>

          <div className="space-y-4">
            {/* Ringkasan */}
            <TextInput
              label="Ringkasan Singkat"
              required
              value={formRingkasan}
              onChange={(e) => onRingkasanChange(e.target.value)}
              disabled={formSubmitting}
              error={formErrors.ringkasan}
              placeholder="Ringkasan 1-2 kalimat untuk kartu program..."
            />

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
            <TextInput
              label={
                <>
                  URL Gambar Sampul <span className="text-brand-400 font-normal">(opsional)</span>
                </>
              }
              value={formImageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              disabled={formSubmitting}
              placeholder="https://images.unsplash.com/..."
              hint="Bila dikosongkan, kartu otomatis memakai ilustrasi bawaan sesuai kategori program."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export const AdminProgramFormModal = AdminProgramCreateModal;
export type AdminProgramFormModalProps = AdminProgramCreateModalProps;
