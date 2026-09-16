import { SearchInput } from "@/components/molecules/SearchInput";
import { FilterSelect } from "@/components/molecules/FilterSelect";
import type { Program } from "@/types";
import type { AdminDisbursementSort } from "@/hooks/useAdminDisbursement";

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru Direalisasikan" },
  { value: "oldest", label: "Paling Awal" },
  { value: "nominal_desc", label: "Nominal Tertinggi" },
  { value: "nominal_asc", label: "Nominal Terendah" },
];

export interface AdminDisbursementFilterBarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  selectedProgramId: string;
  onProgramChange: (val: string) => void;
  selectedSort: AdminDisbursementSort;
  onSortChange: (val: AdminDisbursementSort) => void;
  programs: Program[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function AdminDisbursementFilterBar({
  searchInput,
  onSearchChange,
  selectedProgramId,
  onProgramChange,
  selectedSort,
  onSortChange,
  programs,
  hasActiveFilters,
  onResetFilters,
}: AdminDisbursementFilterBarProps) {
  const programOptions = [
    { value: "", label: "Semua Program Wakaf & Zakat" },
    ...programs.map((p) => ({
      value: p.id,
      label: p.nama,
    })),
  ];

  return (
    <div className="rounded-2xl border border-brand-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Baris 1: Pencarian & Filter Sekunder */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
        {/* Input Pencarian */}
        <div className="lg:col-span-5">
          <SearchInput
            value={searchInput}
            onChange={onSearchChange}
            placeholder="Cari judul penyaluran, rincian nota, program..."
          />
        </div>

        {/* Filter Program */}
        <div className="lg:col-span-4">
          <FilterSelect
            label="Filter Program"
            value={selectedProgramId}
            onChange={onProgramChange}
            options={programOptions}
            placeholder="Semua Program"
          />
        </div>

        {/* Urutan */}
        <div className="lg:col-span-3">
          <FilterSelect
            label="Urutan"
            value={selectedSort}
            onChange={(val) => onSortChange(val as AdminDisbursementSort)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Quick Action: Reset Filter bila sedang aktif */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 border-t border-brand-100/70 text-xs text-brand-600">
          <span className="text-brand-500">Filter pencarian aktif</span>
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-outline py-1.5 px-3 text-xs text-brand-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Reset Filter</span>
          </button>
        </div>
      )}
    </div>
  );
}
