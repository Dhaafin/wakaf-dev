"use client";

import { useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlashMessageContext,
  type FlashMessageKind,
} from "@/context/FlashMessageContext";

const KIND_CONFIG: Record<
  FlashMessageKind,
  {
    badgeClass: string;
    borderClass: string;
    icon: ReactNode;
  }
> = {
  success: {
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200/60",
    borderClass: "border-emerald-100/90 shadow-emerald-950/5",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    ),
  },
  error: {
    badgeClass: "bg-red-100 text-red-600 border-red-200/60",
    borderClass: "border-red-100/90 shadow-red-950/5",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  warning: {
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200/60",
    borderClass: "border-amber-100/90 shadow-amber-950/5",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  },
  info: {
    badgeClass: "bg-brand-100 text-brand-800 border-brand-200/60",
    borderClass: "border-brand-100/90 shadow-brand-950/5",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    ),
  },
};

export function FlashMessageViewport() {
  const ctx = useContext(FlashMessageContext);
  if (!ctx) return null;

  const { messages, dismiss } = ctx;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-5 z-[110] flex flex-col items-center gap-2.5 px-4 max-w-lg mx-auto"
    >
      <AnimatePresence mode="sync">
        {messages.map((m) => {
          const config = KIND_CONFIG[m.kind] || KIND_CONFIG.info;

          return (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.94 }}
              transition={{
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 w-full rounded-2xl border bg-white/95 backdrop-blur-md p-3.5 shadow-xl shadow-brand-950/10 ${config.borderClass}`}
            >
              {/* Badge Icon */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${config.badgeClass}`}
              >
                {config.icon}
              </div>

              {/* Text Details */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs sm:text-sm font-bold text-brand-950 leading-snug">
                  {m.title}
                </p>
                {m.desc && (
                  <p className="mt-0.5 text-[11px] sm:text-xs text-brand-600 leading-relaxed line-clamp-3">
                    {m.desc}
                  </p>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => dismiss(m.id)}
                className="shrink-0 rounded-lg p-1 text-brand-400 hover:bg-sand-100 hover:text-brand-800 transition cursor-pointer"
                title="Tutup pesan"
                aria-label="Tutup pesan notifikasi"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
