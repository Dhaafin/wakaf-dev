import { SearchInput } from "@/components/molecules/SearchInput";
import { FilterSelect } from "@/components/molecules/FilterSelect";
import { SegmentedTabs, type SegmentTabItem } from "@/components/molecules/SegmentedTabs";
import type { Program, TransactionStatus, TransactionStatsSummary } from "@/types";
import type { AdminTransactionSort } from "@/hooks/useAdminTransaction";

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru Dibuat" },
  { value: "oldest", label: "Paling Awal" },
  { value: "nominal_desc", label: "Nominal Tertinggi" },
  { value: "nominal_asc", label: "Nominal Terendah" },
];

export interface AdminTransactionFilterBarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  selectedStatus: "all" | TransactionStatus;
  onStatusChange: (status: "all" | TransactionStatus) => void;
  selectedProgramId: string;
  onProgramChange: (val: string) => void;
  selectedSort: AdminTransactionSort;
  onSortChange: (val: AdminTransactionSort) => void;
  programs: Program[];
  statsSummary: TransactionStatsSummary;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function AdminTransactionFilterBar({
  searchInput,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedProgramId,
  onProgramChange,
  selectedSort,
  onSortChange,
  programs,
  statsSummary,
  hasActiveFilters,
  onResetFilters,
}: AdminTransactionFilterBarProps) {
  const statusTabs: SegmentTabItem<"all" | TransactionStatus>[] = [
    {
      value: "all",
      label: "Semua",
      count: statsSummary.totalCount,
    },
    {
      value: "paid",
      label: "Lunas / Sah",
      count: statsSummary.paidCount,
      dotColor: "bg-emerald-500",
    },
    {
      value: "pending",
      label: "Menunggu",
      count: statsSummary.pendingCount,
      dotColor: "bg-amber-500",
    },
    {
      value: "expired",
      label: "Kedaluwarsa",
      count: statsSummary.expiredCount,
      dotColor: "bg-slate-400",
    },
  ];

  const programOptions = [
    { value: "", label: "Semua Program Wakaf & Zakat" },
    ...programs.map((p) => ({
      value: p.id,
      label: p.nama,
    })),
  ];

  return (
    <div className="rounded-2xl border border-brand-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Baris 1: Segmented Status Tabs & Quick Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto pb-1 lg:pb-0">
          <SegmentedTabs
            items={statusTabs}
            value={selectedStatus}
            onChange={onStatusChange}
          />
        </div>

        <div className="w-full lg:w-72">
          <SearchInput
            value={searchInput}
            onChange={onSearchChange}
            placeholder="Cari ID, wakif, email, program..."
          />
        </div>
      </div>

      {/* Baris 2: Filter Sekunder (Program & Sort) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end pt-2 border-t border-brand-100/70">
        {/* Filter Program */}
        <div className="lg:col-span-8">
          <FilterSelect
            label="Filter Berdasarkan Program"
            value={selectedProgramId}
            onChange={onProgramChange}
            options={programOptions}
            placeholder="Semua Program"
          />
        </div>

        {/* Urutan */}
        <div className="lg:col-span-4">
          <FilterSelect
            label="Urutan Tampilan"
            value={selectedSort}
            onChange={(val) => onSortChange(val as AdminTransactionSort)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Baris 3: Reset filter banner bila ada filter aktif */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 border-t border-brand-100/70 text-xs text-brand-600">
          <span className="text-brand-500">Filter transaksi sedang aktif</span>
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
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}
    </div>
  );
}
