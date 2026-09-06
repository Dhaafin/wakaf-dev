"use client";

import { useRef, useState } from "react";

// MOCK FILE UPLOAD.
// Tidak mengunggah ke mana pun — file dibaca di browser sebagai data URL
// (base64) lalu dikirim ke API route sebagai string biasa dan disimpan di
// mock-db. Cukup untuk menampilkan preview bukti penyaluran pada demo.
// PRODUKSI: ganti dengan upload ke object storage (S3/GCS) + simpan URL-nya.
export function MockFileInput({
  value,
  fileName,
  onChange,
  invalid,
}: {
  value: string;
  fileName: string;
  onChange: (dataUrl: string, fileName: string) => void;
  invalid?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Hanya berkas gambar (JPG/PNG) yang didukung untuk demo ini.");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result), file.name);
      setBusy(false);
    };
    reader.onerror = () => setBusy(false);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {value ? (
        <div className="overflow-hidden rounded-xl border border-brand-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Pratinjau bukti"
            className="max-h-52 w-full object-cover"
          />
          <div className="flex items-center justify-between gap-2 bg-brand-50 px-3 py-2 text-xs">
            <span className="truncate text-brand-600">{fileName}</span>
            <button
              type="button"
              onClick={() => onChange("", "")}
              className="font-semibold text-red-600 hover:underline"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-8 text-sm transition ${
            invalid
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-brand-200 bg-brand-50/50 text-brand-500 hover:border-brand-400 hover:bg-brand-50"
          }`}
        >
          <span className="text-2xl">🖼️</span>
          {busy ? "Memproses gambar…" : "Klik untuk mengunggah bukti (gambar)"}
          <span className="text-xs text-brand-400">
            Mock upload — gambar hanya diproses di browser
          </span>
        </button>
      )}
    </div>
  );
}
