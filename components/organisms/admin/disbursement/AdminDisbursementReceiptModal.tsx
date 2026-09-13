import { Modal } from "@/components/molecules/Modal";
import { formatRupiah, formatTanggal } from "@/lib/format";
import type { DisbursementWithProgram } from "@/types";

export interface AdminDisbursementReceiptModalProps {
  item: DisbursementWithProgram | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminDisbursementReceiptModal({
  item,
  isOpen,
  onClose,
}: AdminDisbursementReceiptModalProps) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pratinjau Bukti & Kuitansi Penyaluran"
      description={`Dokumentasi resmi untuk penyaluran dana program: ${item.program?.nama || "Program Wakaf"}`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          {item.buktiImageUrl ? (
            <a
              href={item.buktiImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 transition"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              <span>Buka Gambar Ukuran Asli</span>
            </a>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-4 py-2 text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Info Ringkas */}
        <div className="rounded-xl bg-brand-50/70 border border-brand-100 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-brand-500 font-medium">Judul Realisasi:</span>
            <p className="font-bold text-brand-950 text-sm mt-0.5">{item.judul}</p>
          </div>
          <div className="text-right">
            <span className="text-brand-500 font-medium">Nominal:</span>
            <p className="font-serif font-bold text-brand-950 text-sm text-accent-800 mt-0.5">
              {formatRupiah(item.nominal)}
            </p>
          </div>
        </div>

        {/* Gambar Bukti */}
        {item.buktiImageUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-brand-950/5 flex items-center justify-center min-h-[260px] max-h-[460px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.buktiImageUrl}
              alt={`Bukti ${item.judul}`}
              className="max-h-[440px] w-auto max-w-full rounded-xl object-contain shadow-sm"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 py-12 text-center">
            <svg
              className="h-10 w-10 text-brand-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <p className="mt-2 text-xs font-semibold text-brand-700">
              Tidak Ada Lampiran Gambar
            </p>
            <p className="mt-0.5 text-[11px] text-brand-400">
              Laporan ini dicatat tanpa berkas foto kuitansi/nota pendukung.
            </p>
          </div>
        )}

        {/* Deskripsi & Catatan */}
        {item.deskripsi && (
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
              Catatan / Rincian Realisasi
            </span>
            <p className="text-xs text-brand-700 bg-brand-50/40 rounded-xl p-3 border border-brand-100/70 whitespace-pre-line leading-relaxed">
              {item.deskripsi}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-brand-400 pt-1">
          <span>ID Laporan: <code className="font-mono text-brand-600">{item.id}</code></span>
          <span>Tanggal: {formatTanggal(item.tanggal)}</span>
        </div>
      </div>
    </Modal>
  );
}
