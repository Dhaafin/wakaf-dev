"use client";

import type { CategoryMeta } from "@/types";
import { Modal } from "./Modal";

export interface CategoryExtraModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryMeta[];
  selectedKategori: string;
  onSelectKategori: (key: string) => void;
}

export function CategoryExtraModal({
  isOpen,
  onClose,
  categories,
  selectedKategori,
  onSelectKategori,
}: CategoryExtraModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Semua Kategori Program"
      description="Pilih kategori peruntukan dana wakaf, infaq, dan zakat"
      maxWidth="lg"
      headerVariant="brand"
    >
      <div className="py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categories.map((c) => {
            const isActive = selectedKategori === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  onSelectKategori(c.key);
                  onClose();
                }}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-brand-700 text-white font-bold border-brand-800 shadow-xs"
                    : "bg-brand-50/70 border-brand-200/80 text-brand-900 hover:bg-brand-100 hover:border-brand-300"
                }`}
              >
                <span className="truncate mr-2">{c.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                    isActive ? "bg-white/20 text-white" : "bg-brand-200/70 text-brand-800"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
