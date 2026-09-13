"use client";

import {
  useState,
  useRef,
  type ReactNode,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { upload } from "@vercel/blob/client";
import { Spinner } from "@/components/atoms/Spinner";

export interface FileInputProps {
  label?: ReactNode;
  value?: string;
  onChange: (url: string) => void;
  maxSizeMb?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  containerClassName?: string;
  allowManualUrl?: boolean;
  folder?: string;
}

export function FileInput({
  label,
  value = "",
  onChange,
  maxSizeMb = 5,
  disabled = false,
  required = false,
  error,
  hint,
  containerClassName = "",
  allowManualUrl = true,
  folder = "programs",
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");

  const effectiveError = error || localError;

  async function handleFileProcess(file: File) {
    setLocalError(null);

    // 1. Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setLocalError("Format berkas tidak valid. Harap pilih gambar (JPG, PNG, WebP, GIF, SVG).");
      return;
    }

    // 2. Validasi batas ukuran file (default 5MB)
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setLocalError(
        `Ukuran gambar (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal ${maxSizeMb} MB.`,
      );
      return;
    }

    // 3. Proses Direct Upload ke Vercel Blob
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const pathname = `${folder}/${Date.now()}-${sanitizedName}`;

      const newBlob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round(progressEvent.percentage));
        },
      });

      onChange(newBlob.url);
      setUploadProgress(100);
    } catch (err) {
      console.error("Vercel Blob upload error:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Gagal mengunggah gambar ke server Vercel Blob.";
      setLocalError(errMsg);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // Reset file input agar file yang sama bisa dipilih ulang bila diinginkan
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (disabled || isUploading) return;
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  }

  function handleRemove() {
    onChange("");
    setLocalError(null);
  }

  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Label & Toggle Mode */}
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="label mb-0">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {allowManualUrl && !isUploading && (
          <button
            type="button"
            onClick={() => {
              setLocalError(null);
              setMode((m) => (m === "upload" ? "url" : "upload"));
            }}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition hover:underline"
          >
            {mode === "upload" ? "🔗 Tautkan URL Manual" : "📁 Unggah File Lokal"}
          </button>
        )}
      </div>

      {/* Input File Tersembunyi */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        disabled={disabled || isUploading}
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Mode 1: Manual URL Input */}
      {mode === "url" ? (
        <div className="space-y-3">
          <input
            type="url"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={`input ${effectiveError ? "input-error" : ""}`}
          />
          {value && (
            <div className="relative overflow-hidden rounded-xl border border-brand-200 bg-brand-50/50 p-2">
              <div className="flex items-center justify-between gap-2 px-1 pb-2">
                <span className="text-xs font-medium text-brand-700 truncate">
                  Pratinjau Gambar:
                </span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline"
                >
                  Hapus
                </button>
              </div>
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-white border border-brand-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Pratinjau gambar program"
                  className="h-full w-full object-cover"
                  onError={() =>
                    setLocalError("Tautan URL gambar tidak dapat dimuat atau rusak.")
                  }
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Drag & Drop File Upload Dropzone */
        <div>
          {/* Kondisi A: Gambar Sudah Terisi */}
          {value && !isUploading ? (
            <div className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm transition hover:border-brand-300">
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Gambar program terpilih"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-white">
                  <span className="text-xs font-medium truncate max-w-[70%] drop-shadow-sm">
                    {value.startsWith("blob:") || value.includes("vercel-storage")
                      ? "✓ Berkas terunggah ke Vercel Blob"
                      : value}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-900 shadow-sm backdrop-blur hover:bg-white transition"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={handleRemove}
                      className="rounded-lg bg-red-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur hover:bg-red-600 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : isUploading ? (
            /* Kondisi B: Sedang Mengunggah */
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-brand-300 bg-brand-50/50 p-6 text-center animate-pulse">
              <Spinner className="h-8 w-8 text-brand-600 mb-3" />
              <p className="text-xs font-bold text-brand-900">
                Mengunggah ke Vercel Blob… ({uploadProgress}%)
              </p>
              <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-brand-200">
                <div
                  className="h-full bg-brand-600 transition-all duration-200 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-brand-500">
                Harap tunggu sejenak, berkas sedang diproses.
              </p>
            </div>
          ) : (
            /* Kondisi C: Dropzone Kosong */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!disabled) fileInputRef.current?.click();
              }}
              className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? "border-brand-600 bg-brand-100/60 scale-[0.99]"
                  : effectiveError
                    ? "border-red-300 bg-red-50/50 hover:bg-red-50"
                    : "border-brand-200 bg-white hover:border-brand-400 hover:bg-brand-50/40"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100/80 text-brand-700 transition group-hover:scale-110 group-hover:bg-brand-200/80">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="mt-3 text-xs font-semibold text-brand-900">
                <span className="text-brand-600 underline">Pilih foto</span> atau seret
                dan lepas ke sini
              </p>
              <p className="mt-1 text-[11px] text-brand-500">
                Format JPG, PNG, WebP, atau GIF (Maks. {maxSizeMb}MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tampilan Error & Hint */}
      {effectiveError && (
        <p className="field-error mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <span>⚠️</span> {effectiveError}
        </p>
      )}
      {hint && !effectiveError && (
        <p className="mt-1.5 text-[11px] text-brand-400">{hint}</p>
      )}
    </div>
  );
}
