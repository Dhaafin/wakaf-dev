import type { InputHTMLAttributes, ReactNode } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export function TextInput({
  label,
  required,
  error,
  hint,
  containerClassName = "",
  className = "",
  disabled,
  ...props
}: TextInputProps) {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        disabled={disabled}
        className={`input ${error ? "input-error" : ""} ${className}`}
        {...props}
      />
      {error && <p className="field-error">{error}</p>}
      {hint && !error && <p className="mt-1 text-[11px] text-brand-400">{hint}</p>}
    </div>
  );
}
