"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export type ModalMaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

const MAX_WIDTH_CLASSES: Record<ModalMaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-[calc(100vw-2rem)]",
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: ModalMaxWidth;
  headerVariant?: "default" | "brand";
  headerClassName?: string;
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "2xl",
  headerVariant = "default",
  headerClassName = "",
  showCloseButton = true,
  preventBackdropClose = false,
  className = "",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // Pastikan komponen hanya di-mount di client (menghindari hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup modal jika tombol Escape ditekan
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventBackdropClose) {
        onClose();
      }
    },
    [onClose, preventBackdropClose],
  );

  // Kunci scrollbar dokumen saat modal aktif
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  const isBrandHeader = headerVariant === "brand";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden pointer-events-none select-none sm:select-auto"
        >
          {/* Backdrop Blur Global — menutupi 100% viewport termasuk sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => {
              if (!preventBackdropClose) onClose();
            }}
            className="fixed inset-0 bg-brand-950/65 backdrop-blur-md cursor-pointer pointer-events-auto"
            aria-hidden="true"
          />

          {/* Floating Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1], // Smooth iOS-like spring damping
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${MAX_WIDTH_CLASSES[maxWidth]} rounded-3xl bg-white shadow-2xl shadow-brand-950/30 ring-1 ring-black/10 border border-brand-100/90 overflow-hidden flex flex-col max-h-[88vh] pointer-events-auto z-10 ${className}`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div
                className={`flex items-start justify-between px-6 py-5 shrink-0 ${
                  isBrandHeader
                    ? "bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white border-b border-brand-800/80"
                    : "border-b border-brand-100/90 bg-gradient-to-b from-brand-50/70 to-white text-brand-950"
                } ${headerClassName}`}
              >
                <div className="pr-4 min-w-0">
                  {typeof title === "string" ? (
                    <h3
                      className={`font-serif text-xl font-bold tracking-tight ${
                        isBrandHeader ? "text-white" : "text-brand-950"
                      }`}
                    >
                      {title}
                    </h3>
                  ) : (
                    title
                  )}
                  {description && (
                    <div
                      className={`mt-1 text-xs leading-relaxed ${
                        isBrandHeader ? "text-brand-200/90" : "text-brand-500"
                      }`}
                    >
                      {description}
                    </div>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all shadow-2xs focus:outline-none focus:ring-2 active:scale-95 ${
                      isBrandHeader
                        ? "border-white/15 bg-white/10 text-brand-200 hover:bg-white/20 hover:text-white focus:ring-white/20"
                        : "border-brand-200/60 bg-white text-brand-400 hover:bg-brand-50 hover:text-brand-800 focus:ring-brand-500/20"
                    }`}
                    title="Tutup dialog (Esc)"
                    aria-label="Tutup dialog"
                  >
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
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {/* Optional Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-brand-100 bg-brand-50/40 px-6 py-4 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
