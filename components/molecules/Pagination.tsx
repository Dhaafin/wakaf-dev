export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  startItem: number;
  endItem: number;
  limit: number;
  limitOptions?: number[];
  itemName?: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  startItem,
  endItem,
  limit,
  limitOptions = [5, 10, 20, 50],
  itemName = "data",
  onPageChange,
  onLimitChange,
  className = "",
}: PaginationProps) {
  if (total === 0) return null;

  return (
    <div
      className={`flex flex-col gap-3 border-t border-brand-100 bg-brand-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between text-xs text-brand-600 ${className}`}
    >
      {/* Kiri: Ringkasan Item & Selector Baris */}
      <div className="flex flex-wrap items-center gap-2">
        <span>
          Menampilkan <strong className="text-brand-950">{startItem}</strong>–
          <strong className="text-brand-950">{endItem}</strong> dari{" "}
          <strong className="text-brand-950">{total}</strong> total {itemName}
        </span>
        <span className="text-brand-300">|</span>
        <div className="flex items-center gap-1.5">
          <span>Baris:</span>
          <select
            value={limit}
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="rounded-lg border border-brand-200 bg-white py-1 px-2 text-xs font-semibold text-brand-950 focus:border-brand-500 focus:outline-none"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanan: Navigasi Halaman */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-semibold text-brand-800 transition hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
        >
          ← Sebelumnya
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              return (
                <div key={p} className="flex items-center">
                  {prev && p - prev > 1 && (
                    <span className="px-1 text-brand-400">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`h-7 w-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                      page === p
                        ? "bg-brand-600 text-white shadow-xs"
                        : "text-brand-700 hover:bg-brand-100/70"
                    }`}
                  >
                    {p}
                  </button>
                </div>
              );
            })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-semibold text-brand-800 transition hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
        >
          Berikutnya →
        </button>
      </div>
    </div>
  );
}
