"use client";

import { useToast } from "@/lib/store/toast";

const ICON = { success: "✅", error: "⚠️", info: "ℹ️" } as const;
const RING = {
  success: "border-l-emerald-500",
  error: "border-l-red-500",
  info: "border-l-brand-500",
} as const;

export function ToastViewport() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto w-full max-w-sm animate-fade-in rounded-xl border border-brand-100 border-l-4 bg-white p-4 shadow-lg ${RING[t.kind]}`}
          role="status"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">{ICON[t.kind]}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-950">{t.title}</p>
              {t.desc && (
                <p className="mt-0.5 text-xs text-brand-600">{t.desc}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-brand-400 hover:text-brand-700"
              aria-label="Tutup notifikasi"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
