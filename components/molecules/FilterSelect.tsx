"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  disabled = false,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
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

  // Client-only mount for portal safety
  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const flipUp = window.innerHeight - rect.bottom < 220 && rect.top > 220;

    setCoords({
      top: flipUp ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      flipUp,
    });
  }, []);

  // Update coords and event listeners when opened
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
      if (e.key === "Escape") setIsOpen(false);
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

  // Label text to display on the trigger button
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption
    ? selectedOption.label
    : placeholder || "Pilih opsi";

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            updateCoords();
            setIsOpen((prev) => !prev);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`input flex items-center justify-between gap-2 py-2 px-3 text-xs w-full text-left bg-white transition hover:border-brand-300 focus:border-brand-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? "border-brand-500 ring-2 ring-brand-500/15" : ""
        }`}
      >
        <span
          className={`truncate ${
            !selectedOption && placeholder ? "text-brand-400" : "text-brand-950 font-medium"
          }`}
        >
          {displayText}
        </span>

        <svg
          className={`h-3.5 w-3.5 text-brand-400 shrink-0 transition-transform duration-200 ${
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

      {/* Custom Popup Menu Teleported via React Portal */}
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
                  width: `${Math.max(coords.width, 170)}px`,
                  maxWidth: "92vw",
                  zIndex: 9999,
                }}
                className="rounded-2xl border border-brand-100 bg-white/95 backdrop-blur-md p-1.5 shadow-xl shadow-brand-950/15 overflow-hidden"
              >
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {/* Default / Placeholder option */}
                  {placeholder && (
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === ""}
                      onClick={() => {
                        onChange("");
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                        value === ""
                          ? "bg-brand-50 font-semibold text-brand-900"
                          : "text-brand-600 hover:bg-sand-50 hover:text-brand-900"
                      }`}
                    >
                      <span className="truncate">{placeholder}</span>
                      {value === "" && (
                        <svg
                          className="h-3.5 w-3.5 text-brand-600 shrink-0 ml-1.5"
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
                  )}

                  {/* Options List */}
                  {options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(opt.value);
                          setIsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                          isSelected
                            ? "bg-brand-50 font-semibold text-brand-900"
                            : "text-brand-700 hover:bg-sand-50 hover:text-brand-950"
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <svg
                            className="h-3.5 w-3.5 text-brand-600 shrink-0 ml-1.5"
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
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
