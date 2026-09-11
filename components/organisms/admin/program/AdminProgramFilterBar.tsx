import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  type ProgramCategory,
  type ProgramType,
} from "@/types";
import { SearchInput } from "@/components/molecules/SearchInput";
import { SegmentedTabs, type SegmentTabItem } from "@/components/molecules/SegmentedTabs";
import { FilterSelect } from "@/components/molecules/FilterSelect";
import type { AdminProgramSort, AdminProgramStatusFilter } from "@/hooks/useAdminProgram";

const TYPE_OPTIONS = (Object.keys(PROGRAM_TYPE_LABEL) as ProgramType[]).map((t) => ({
  value: t,
  label: PROGRAM_TYPE_LABEL[t],
}));

const CATEGORY_OPTIONS = (Object.keys(PROGRAM_CATEGORY_LABEL) as ProgramCategory[]).map((c) => ({
  value: c,
  label: PROGRAM_CATEGORY_LABEL[c],
}));

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru Ditambahkan" },
  { value: "oldest", label: "Paling Lama" },
  { value: "target_desc", label: "Target Dana Tertinggi" },
  { value: "target_asc", label: "Target Dana Terendah" },
];

export interface AdminProgramFilterBarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  selectedStatus: AdminProgramStatusFilter;
  onStatusChange: (status: AdminProgramStatusFilter) => void;
  total: number;
  activeCount: number;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedKategori: string;
  onKategoriChange: (val: string) => void;
  selectedSort: AdminProgramSort;
  onSortChange: (val: AdminProgramSort) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function AdminProgramFilterBar({
  searchInput,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  total,
  activeCount,
  selectedType,
  onTypeChange,
  selectedKategori,
  onKategoriChange,
  selectedSort,
  onSortChange,
  hasActiveFilters,
  onResetFilters,
}: AdminProgramFilterBarProps) {
  const statusTabs: SegmentTabItem<AdminProgramStatusFilter>[] = [
    { value: "all", label: "Semua", count: total },
    { value: "active", label: "Aktif", count: activeCount, dotColor: "bg-emerald-500" },
    { value: "inactive", label: "Nonaktif", count: Math.max(0, total - activeCount), dotColor: "bg-zinc-400" },
  ];

  return (
    <div className="rounded-2xl border border-brand-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Baris 1: Pencarian & Segment Tab Status */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchInput}
          onChange={onSearchChange}
          placeholder="Cari nama program, deskripsi, kota/lokasi..."
        />

        <SegmentedTabs
          items={statusTabs}
          value={selectedStatus}
          onChange={onStatusChange}
          className="self-start sm:self-auto"
        />
      </div>

      {/* Baris 2: Dropdown Filter Sekunder (Jenis, Kategori, Urutan) & Reset */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 pt-1">
        <FilterSelect
          label="Jenis Instrumen"
          value={selectedType}
          onChange={onTypeChange}
          options={TYPE_OPTIONS}
          placeholder="Semua Jenis Program"
        />

        <FilterSelect
          label="Kategori Peruntukan"
          value={selectedKategori}
          onChange={onKategoriChange}
          options={CATEGORY_OPTIONS}
          placeholder="Semua Kategori"
        />

        <FilterSelect
          label="Urutkan Data"
          value={selectedSort}
          onChange={(val) => onSortChange(val as AdminProgramSort)}
          options={SORT_OPTIONS}
        />

        {/* Quick Action: Reset Filter */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex items-end">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="btn-outline w-full py-2 px-3 text-xs text-brand-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reset Semua Filter</span>
            </button>
          ) : (
            <div className="hidden lg:flex w-full items-center justify-center py-2 text-[11px] text-brand-400">
              <span>Filter standar aktif</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
