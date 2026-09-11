"use client";

import { useEffect, useCallback, type ReactNode } from "react";
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
  showCloseButton = true,
  preventBackdropClose = false,
  className = "",
}: ModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop Blur & Dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => {
              if (!preventBackdropClose) onClose();
            }}
            className="fixed inset-0 bg-brand-950/65 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{
              duration: 0.26,
              ease: [0.16, 1, 0.3, 1], // Natural iOS-style ease-out
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${MAX_WIDTH_CLASSES[maxWidth]} rounded-3xl bg-white shadow-2xl border border-brand-100/90 overflow-hidden flex flex-col max-h-[90vh] z-10 ${className}`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between border-b border-brand-100 bg-brand-50/40 px-6 py-4.5 shrink-0">
                <div className="pr-4 min-w-0">
                  {typeof title === "string" ? (
                    <h3 className="font-serif text-lg font-bold text-brand-950 tracking-tight">
                      {title}
                    </h3>
                  ) : (
                    title
                  )}
                  {description && (
                    <div className="mt-0.5 text-xs text-brand-500 leading-relaxed">
                      {description}
                    </div>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-brand-400 hover:bg-brand-100 hover:text-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {/* Optional Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-brand-100 bg-brand-50/30 px-6 py-3.5 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
