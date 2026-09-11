import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  type ProgramCategory,
  type ProgramType,
} from "@/types";
import type { AdminProgramSort, AdminProgramStatusFilter } from "@/hooks/useAdminProgram";

const CATEGORIES = Object.keys(PROGRAM_CATEGORY_LABEL) as ProgramCategory[];
const TYPES = Object.keys(PROGRAM_TYPE_LABEL) as ProgramType[];

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
  return (
    <div className="rounded-2xl border border-brand-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Baris 1: Pencarian & Segment Tab Status */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Input Search Modern */}
        <div className="relative flex-1">
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
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama program, deskripsi, kota/lokasi..."
            className="input pl-10 pr-9 text-xs sm:text-sm placeholder:text-brand-400"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-400 hover:text-brand-700"
              title="Hapus kata kunci"
            >
              ✕
            </button>
          )}
        </div>

        {/* Segmented Status Buttons (Pill Tab) */}
        <div className="inline-flex rounded-xl bg-sand-100 p-1 border border-brand-200/60 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onStatusChange("all")}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              selectedStatus === "all"
                ? "bg-white text-brand-950 shadow-xs ring-1 ring-brand-200/50"
                : "text-brand-600 hover:text-brand-950"
            }`}
          >
            Semua
            <span className="ml-1.5 rounded-full bg-brand-100/70 px-1.5 py-0.5 text-[10px] text-brand-700">
              {total}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("active")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              selectedStatus === "active"
                ? "bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-200/50"
                : "text-brand-600 hover:text-brand-950"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Aktif</span>
            <span className="ml-1 rounded-full bg-emerald-100/70 px-1.5 py-0.5 text-[10px] text-emerald-800">
              {activeCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("inactive")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              selectedStatus === "inactive"
                ? "bg-white text-zinc-900 shadow-xs ring-1 ring-zinc-200/50"
                : "text-brand-600 hover:text-brand-950"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            <span>Nonaktif</span>
            <span className="ml-1 rounded-full bg-zinc-200/70 px-1.5 py-0.5 text-[10px] text-zinc-700">
              {Math.max(0, total - activeCount)}
            </span>
          </button>
        </div>
      </div>

      {/* Baris 2: Dropdown Filter Sekunder (Jenis, Kategori, Urutan) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 pt-1">
        {/* Dropdown Jenis */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
            Jenis Instrumen
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="input py-2 px-3 text-xs"
          >
            <option value="">Semua Jenis Program</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {PROGRAM_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Kategori */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
            Kategori Peruntukan
          </label>
          <select
            value={selectedKategori}
            onChange={(e) => onKategoriChange(e.target.value)}
            className="input py-2 px-3 text-xs"
          >
            <option value="">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {PROGRAM_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Sorting */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
            Urutkan Data
          </label>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as AdminProgramSort)}
            className="input py-2 px-3 text-xs"
          >
            <option value="latest">Terbaru Ditambahkan</option>
            <option value="oldest">Paling Lama</option>
            <option value="target_desc">Target Dana Tertinggi</option>
            <option value="target_asc">Target Dana Terendah</option>
          </select>
        </div>

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
