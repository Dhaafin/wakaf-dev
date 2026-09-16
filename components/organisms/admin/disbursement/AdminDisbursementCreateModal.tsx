import { Modal } from "@/components/molecules/Modal";
import { TextInput } from "@/components/molecules/TextInput";
import { RupiahInput } from "@/components/molecules/RupiahInput";
import { FileInput } from "@/components/molecules/FileInput";
import { SelectDropdown } from "@/components/molecules/SelectDropdown";
import { Spinner } from "@/components/atoms/Spinner";
import { formatRupiah } from "@/lib/format";
import type { Program } from "@/types";

export interface AdminDisbursementCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  selectedProgram?: Program;
  formProgramId: string;
  onProgramIdChange: (id: string) => void;
  formJudul: string;
  onJudulChange: (val: string) => void;
  formDeskripsi: string;
  onDeskripsiChange: (val: string) => void;
  formNominal: number | "";
  onNominalChange: (val: number | "") => void;
  formBuktiImageUrl: string;
  onBuktiImageUrlChange: (url: string) => void;
  formBuktiFileName: string;
  onBuktiFileNameChange: (name: string) => void;
  formErrors: Record<string, string>;
  formSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminDisbursementCreateModal({
  isOpen,
  onClose,
  programs,
  selectedProgram,
  formProgramId,
  onProgramIdChange,
  formJudul,
  onJudulChange,
  formDeskripsi,
  onDeskripsiChange,
  formNominal,
  onNominalChange,
  formBuktiImageUrl,
  onBuktiImageUrlChange,
  formBuktiFileName: _formBuktiFileName,
  onBuktiFileNameChange,
  formErrors,
  formSubmitting,
  onSubmit,
}: AdminDisbursementCreateModalProps) {
  const programOptions = programs.map((p) => ({
    value: p.id,
    label: p.nama,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Penyaluran Dana Baru"
      description="Dokumentasikan realisasi dana wakaf/zakat secara transparan lengkap dengan kuitansi/bukti sah."
      maxWidth="xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Pilih Program */}
        <div>
          <SelectDropdown
            label="Program Target Realisasi"
            value={formProgramId}
            onChange={onProgramIdChange}
            options={programOptions}
            placeholder="Pilih program..."
            error={formErrors.programId}
            required
          />

          {selectedProgram && (
            <div className="mt-2 rounded-xl bg-brand-50/80 p-3 text-xs text-brand-700 border border-brand-200/60 flex items-center justify-between">
              <div>
                <span className="text-brand-500 font-medium">Terkumpul: </span>
                <strong className="text-brand-950 font-semibold">
                  {formatRupiah(selectedProgram.terkumpul)}
                </strong>
              </div>
              <div className="text-brand-300">•</div>
              <div>
                <span className="text-brand-500 font-medium">Telah Disalurkan: </span>
                <strong className="text-brand-950 font-semibold">
                  {formatRupiah(
                    selectedProgram.disbursements?.reduce(
                      (acc, d) => acc + d.nominal,
                      0,
                    ) || 0,
                  )}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Judul Penyaluran */}
        <TextInput
          label="Judul Realisasi / Nota"
          value={formJudul}
          onChange={(e) => onJudulChange(e.target.value)}
          placeholder="Contoh: Pembelian Semen & Bata Tahap 1"
          error={formErrors.judul}
          required
        />

        {/* Deskripsi / Rincian */}
        <div>
          <label className="label">
            Rincian / Deskripsi Penyaluran
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={formDeskripsi}
            onChange={(e) => onDeskripsiChange(e.target.value)}
            rows={3}
            placeholder="Rincian peruntukan dana, nomor faktur/nota, atau nama toko penyedia..."
            className={`input resize-none text-xs ${
              formErrors.deskripsi ? "input-error" : ""
            }`}
          />
          {formErrors.deskripsi && (
            <p className="field-error">{formErrors.deskripsi}</p>
          )}
        </div>

        {/* Nominal */}
        <div>
          <label className="label">
            Nominal yang Disalurkan (Rp)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <RupiahInput
            value={formNominal}
            onChange={onNominalChange}
            invalid={Boolean(formErrors.nominal)}
          />
          {formErrors.nominal && (
            <p className="field-error">{formErrors.nominal}</p>
          )}
        </div>

        {/* Upload Bukti Penyaluran */}
        <FileInput
          label="Bukti Kuitansi / Foto Serah Terima (Opsional)"
          value={formBuktiImageUrl}
          onChange={(url) => {
            onBuktiImageUrlChange(url);
            onBuktiFileNameChange(url ? "bukti-penyaluran.jpg" : "");
          }}
          error={formErrors.buktiImageUrl}
          folder="disbursements"
          maxSizeMb={5}
          hint="Unggah nota, kuitansi, atau dokumentasi visual penyaluran ke lapangan (maks. 5MB)."
        />

        {/* Tombol Aksi */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-brand-100">
          <button
            type="button"
            onClick={onClose}
            disabled={formSubmitting}
            className="btn-outline px-4 py-2 text-xs cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={formSubmitting}
            className="btn-primary px-5 py-2 text-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {formSubmitting && <Spinner className="h-4 w-4" />}
            <span>Simpan Laporan Penyaluran</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
