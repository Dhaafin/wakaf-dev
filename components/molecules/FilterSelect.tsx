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
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="input py-2 px-3 text-xs w-full"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
