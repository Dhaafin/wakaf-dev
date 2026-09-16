export interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Cari data...",
  className = "",
  size = "md",
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input pl-10 pr-9 placeholder:text-brand-400 ${
          size === "sm" ? "py-1.5 text-xs" : "text-xs sm:text-sm"
        }`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-400 hover:text-brand-700 transition-colors"
          title="Hapus kata kunci pencarian"
          aria-label="Hapus kata kunci pencarian"
        >
          ✕
        </button>
      )}
    </div>
  );
}
