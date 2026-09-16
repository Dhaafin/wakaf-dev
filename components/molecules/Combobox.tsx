"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  label?: ReactNode;
  value: string;
  onChange: (val: string) => void;
  options: readonly ComboboxOption[] | ComboboxOption[];
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  invalid?: boolean;
  size?: "sm" | "md";
  labelStyle?: "standard" | "uppercase";
  allowCustom?: boolean;
  customItemLabel?: (query: string) => ReactNode;
}

export function Combobox({
  label,
  value,
  onChange,
  options,
  placeholder = "Pilih atau ketik baru...",
  className = "",
  containerClassName = "",
  disabled = false,
  required = false,
  error,
  invalid = false,
  size = "md",
  labelStyle = "standard",
  allowCustom = true,
  customItemLabel,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    flipUp: boolean;
  }>({
    top: 0,
    left: 0,
    width: 0,
    flipUp: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sinkronisasi teks input dengan value yang dipilih saat popup tidak aktif
  const currentOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery(currentOption ? currentOption.label : value);
    }
  }, [value, currentOption, isOpen]);

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const flipUp = window.innerHeight - rect.bottom < 230 && rect.top > 230;

    setCoords({
      top: flipUp ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      flipUp,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateCoords();

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popupRef.current &&
        !popupRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen, updateCoords]);

  // Filter opsi berdasarkan pencarian kata kunci
  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q),
    );
  }, [options, searchQuery]);

  // Cek apakah query yang diketik sudah sama persis dengan opsi yang ada
  const hasExactMatch = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return options.some(
      (opt) =>
        opt.label.toLowerCase() === q || opt.value.toLowerCase() === q,
    );
  }, [options, searchQuery]);

  function handleSelect(val: string) {
    onChange(val);
    setIsOpen(false);
  }

  function handleCommitCustom() {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const matched = options.find(
      (opt) =>
        opt.label.toLowerCase() === trimmed.toLowerCase() ||
        opt.value.toLowerCase() === trimmed.toLowerCase(),
    );
    if (matched) {
      onChange(matched.value);
    } else {
      onChange(trimmed);
    }
    setIsOpen(false);
  }

  const isError = Boolean(error || invalid);

  return (
    <div className={`relative w-full ${containerClassName}`}>
      {label && (
        <label
          className={
            labelStyle === "uppercase"
              ? "mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider"
              : "label"
          }
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Trigger Combobox */}
      <div
        ref={triggerRef}
        className={`input relative flex items-center p-0 overflow-hidden bg-white transition hover:border-brand-300 focus-within:border-brand-500 ${
          isOpen ? "border-brand-500 ring-2 ring-brand-500/15" : ""
        } ${isError ? "input-error" : ""} ${className}`}
      >
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={searchQuery}
          placeholder={placeholder}
          onFocus={() => {
            if (!disabled) {
              updateCoords();
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) {
              updateCoords();
              setIsOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const trimmed = searchQuery.trim().toLowerCase();
              const exact = filteredOptions.find(
                (o) =>
                  o.label.toLowerCase() === trimmed ||
                  o.value.toLowerCase() === trimmed,
              );
              if (exact) {
                handleSelect(exact.value);
              } else if (allowCustom && searchQuery.trim()) {
                handleCommitCustom();
              } else if (filteredOptions.length > 0) {
                handleSelect(filteredOptions[0].value);
              }
            }
          }}
          className={`w-full bg-transparent border-0 outline-none focus:ring-0 text-brand-950 placeholder:text-brand-400 font-medium ${
            size === "sm" ? "py-2 pl-3 pr-8 text-xs" : "py-2.5 pl-3.5 pr-9 text-sm"
          }`}
        />

        {/* Action icons (Clear + Chevron) */}
        <div className="absolute right-2 flex items-center gap-1">
          {searchQuery && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                setSearchQuery("");
                onChange("");
                inputRef.current?.focus();
              }}
              className="p-1 text-brand-400 hover:text-brand-700 transition-colors cursor-pointer"
              title="Hapus isian"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                updateCoords();
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
              }
            }}
            className="p-1 text-brand-400 hover:text-brand-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <svg
              className={`h-4 w-4 text-brand-400 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-brand-600" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>

      {error && <p className="field-error">{error}</p>}

      {/* Dropdown Options Popup via React Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={popupRef}
                role="listbox"
                initial={{ opacity: 0, scale: 0.96, y: coords.flipUp ? 4 : -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: coords.flipUp ? 4 : -4 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: coords.flipUp ? undefined : `${coords.top}px`,
                  bottom: coords.flipUp ? `${window.innerHeight - coords.top}px` : undefined,
                  left: `${coords.left}px`,
                  width: `${Math.max(coords.width, 200)}px`,
                  maxWidth: "92vw",
                  zIndex: 9999,
                }}
                className="rounded-2xl border border-brand-100 bg-white/95 backdrop-blur-md p-1.5 shadow-xl shadow-brand-950/15 overflow-hidden"
              >
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {/* Opsi Tambah Kategori / Jenis Baru jika belum ada exact match */}
                  {allowCustom && searchQuery.trim() && !hasExactMatch && (
                    <button
                      type="button"
                      onClick={handleCommitCustom}
                      className="flex w-full items-center gap-2 rounded-xl bg-accent-50/80 px-3 py-2 text-xs text-accent-950 font-semibold hover:bg-accent-100 transition text-left cursor-pointer border border-accent-200/60"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-accent-500 text-brand-950 font-bold text-xs shrink-0">
                        +
                      </span>
                      <span className="truncate">
                        {customItemLabel ? (
                          customItemLabel(searchQuery.trim())
                        ) : (
                          <>
                            Gunakan opsi baru:{" "}
                            <strong className="text-brand-950">
                              “{searchQuery.trim()}”
                            </strong>
                          </>
                        )}
                      </span>
                    </button>
                  )}

                  {/* Daftar Opsi Tersedia */}
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => {
                      const isSelected = opt.value === value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(opt.value)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm transition text-left cursor-pointer ${
                            isSelected
                              ? "bg-brand-50 font-semibold text-brand-900"
                              : "text-brand-700 hover:bg-sand-50 hover:text-brand-950"
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && (
                            <svg
                              className="h-4 w-4 text-brand-600 shrink-0 ml-1.5"
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
                          )}
                        </button>
                      );
                    })
                  ) : !allowCustom ? (
                    <div className="px-3 py-2.5 text-center text-xs text-brand-400">
                      Tidak ada opsi yang cocok
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
