"use client";

import { type ReactNode } from "react";
import { Modal, type ModalMaxWidth } from "./Modal";
import { Spinner } from "@/components/atoms/Spinner";

export type ConfirmVariant = "danger" | "warning" | "brand";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  itemName?: string;
  loading?: boolean;
  maxWidth?: ModalMaxWidth;
  children?: ReactNode;
}

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  {
    iconBg: string;
    iconColor: string;
    btnClass: string;
    icon: ReactNode;
  }
> = {
  danger: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    btnClass:
      "bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-sm shadow-red-600/30",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
    ),
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    btnClass:
      "bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-sm shadow-amber-600/30",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  },
  brand: {
    iconBg: "bg-brand-100",
    iconColor: "text-brand-700",
    btnClass:
      "bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-sm shadow-brand-600/30",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  description = "Apakah Anda yakin ingin melanjutkan tindakan ini? Perubahan ini mungkin tidak dapat dibatalkan.",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "danger",
  itemName,
  loading = false,
  maxWidth = "md",
  children,
}: ConfirmModalProps) {
  const config = VARIANT_CONFIG[variant];

  const modalFooter = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="btn-outline px-4 py-2 text-xs font-semibold disabled:opacity-50"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className={`px-5 py-2 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 disabled:opacity-60 cursor-pointer ${config.btnClass}`}
      >
        {loading && <Spinner className="h-3.5 w-3.5 text-current" />}
        <span>{confirmText}</span>
      </button>
    </>
  );

  const customHeader = (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ${config.iconColor}`}
      >
        {config.icon}
      </div>
      <h3 className="font-serif text-lg font-bold text-brand-950">{title}</h3>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customHeader}
      footer={modalFooter}
      maxWidth={maxWidth}
      showCloseButton={!loading}
      preventBackdropClose={loading}
    >
      <div className="space-y-3.5 text-xs">
        {description && (
          <p className="text-brand-600 leading-relaxed">{description}</p>
        )}

        {itemName && (
          <div className="rounded-2xl border border-red-200/70 bg-red-50/50 p-3 text-red-950 font-medium">
            <span className="text-[11px] text-red-600 uppercase tracking-wider font-semibold block mb-0.5">
              Program Yang Dipilih:
            </span>
            <span className="text-xs font-semibold text-brand-950">“{itemName}”</span>
          </div>
        )}

        {children}
      </div>
    </Modal>
  );
}
