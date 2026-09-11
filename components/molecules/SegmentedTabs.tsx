export interface SegmentTabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
  dotColor?: string;
}

export interface SegmentedTabsProps<T extends string> {
  items: SegmentTabItem<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className = "",
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={`inline-flex rounded-xl bg-sand-100 p-1 border border-brand-200/60 shrink-0 ${className}`}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(item.value)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              isActive
                ? "bg-white text-brand-950 shadow-xs ring-1 ring-brand-200/50"
                : "text-brand-600 hover:text-brand-950"
            }`}
          >
            {item.dotColor && <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`} />}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive
                    ? "bg-brand-100/80 text-brand-800"
                    : "bg-brand-100/50 text-brand-600"
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
