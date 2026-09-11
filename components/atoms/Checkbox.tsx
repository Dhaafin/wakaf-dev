"use client";

import {
  useRef,
  useEffect,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  label?: ReactNode;
  size?: "sm" | "md";
}

export function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  label,
  size = "md",
  disabled = false,
  className = "",
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <label
      className={`inline-flex items-center gap-2 select-none ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={`${sizeClass} rounded-md border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:ring-offset-0 transition cursor-pointer disabled:cursor-not-allowed accent-brand-600`}
        {...props}
      />
      {label && (
        <span className="text-xs font-medium text-brand-900 leading-none">
          {label}
        </span>
      )}
    </label>
  );
}
