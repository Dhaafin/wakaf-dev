"use client";

import { Spinner } from "@/components/atoms/Spinner";

interface VerificationFormProps {
  kode: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function VerificationForm({
  kode,
  onChange,
  onSubmit,
  loading,
}: VerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={kode}
          onChange={(e) => onChange(e.target.value)}
          placeholder="SW/2026/09/XXXXXX"
          className="input pl-10 font-mono text-sm tracking-wide uppercase placeholder:normal-case placeholder:font-sans placeholder:text-brand-300"
          autoFocus
        />
        {kode && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-400 hover:text-brand-600"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !kode.trim()}
        className="btn-primary shrink-0 flex items-center justify-center gap-2 py-2.5 px-6 shadow-sm transition active:scale-98 disabled:opacity-60 cursor-pointer"
      >
        {loading && <Spinner className="h-4 w-4 text-white" />}
        <span>{loading ? "Memverifikasi…" : "Verifikasi Sertifikat"}</span>
      </button>
    </form>
  );
}
