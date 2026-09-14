"use client";

import { Spinner } from "@/components/atoms/Spinner";

interface CertificateActionsProps {
  downloading: boolean;
  onDownloadPdf: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export function CertificateActions({
  downloading,
  onDownloadPdf,
  onPrint,
  onShare,
}: CertificateActionsProps) {
  return (
    <div className="no-print flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
      {/* Tombol Unduh PDF */}
      <button
        type="button"
        onClick={onDownloadPdf}
        disabled={downloading}
        className="btn-primary inline-flex items-center gap-2 text-sm font-semibold shadow-sm transition active:scale-98 cursor-pointer disabled:opacity-60"
      >
        {downloading ? (
          <Spinner className="h-4 w-4 text-white" />
        ) : (
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        )}
        <span>{downloading ? "Menyiapkan PDF…" : "Unduh Dokumen PDF"}</span>
      </button>

      {/* Tombol Cetak Dokumen */}
      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50/80 active:scale-98 cursor-pointer"
      >
        <svg
          className="h-4 w-4 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.656l10.5 0z"
          />
        </svg>
        <span>Cetak</span>
      </button>

      {/* Tombol Bagikan */}
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50/80 active:scale-98 cursor-pointer"
      >
        <svg
          className="h-4 w-4 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
        <span>Bagikan</span>
      </button>
    </div>
  );
}
