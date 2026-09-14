import Link from "next/link";
import type { Program } from "@/types";
import { PROGRAM_TYPE_LABEL } from "@/types";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { Checkbox } from "@/components/atoms/Checkbox";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { AdminTableSkeleton } from "@/components/molecules/AdminTableSkeleton";
import { Pagination } from "@/components/molecules/Pagination";
import { formatRupiah, persen } from "@/lib/format";
import { getCategoryVisual } from "./AdminProgramVisuals";

export interface AdminProgramTableProps {
  loading: boolean;
  error: string | null;
  items: Program[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  startItem: number;
  endItem: number;
  hasActiveFilters: boolean;
  togglingId: string | null;
  onToggleActive: (prog: Program) => void;
  onCopyLink: (slug: string) => void;
  onEdit: (prog: Program) => void;
  onDelete: (prog: Program) => void;
  selectedIds: string[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenBulkDelete: () => void;
  onClearSelection: () => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onResetFilters: () => void;
  onOpenCreate: () => void;
  onReload: () => void;
  isTrashMode?: boolean;
  onRestore?: (prog: Program) => void;
  restoringId?: string | null;
}

export function AdminProgramTable({
  loading,
  error,
  items,
  total,
  totalPages,
  page,
  limit,
  startItem,
  endItem,
  hasActiveFilters,
  togglingId,
  onToggleActive,
  onCopyLink,
  onEdit,
  onDelete,
  selectedIds,
  isAllSelected,
  isSomeSelected,
  onToggleSelect,
  onToggleSelectAll,
  onOpenBulkDelete,
  onClearSelection,
  onPageChange,
  onLimitChange,
  onResetFilters,
  onOpenCreate,
  onReload,
  isTrashMode = false,
  onRestore,
  restoringId = null,
}: AdminProgramTableProps) {
  return (
    <div className="space-y-3">
      {/* ELEVATED BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-950 p-3.5 px-4 sm:px-5 text-white shadow-xl shadow-brand-950/20 border border-brand-800 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-brand-950">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold sm:text-sm">
              {selectedIds.length} program terpilih
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearSelection}
              className="rounded-xl border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="button"
              onClick={onOpenBulkDelete}
              className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span>Hapus Terpilih ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-brand-200/90 bg-white shadow-xs">
      {loading ? (
        <AdminTableSkeleton rows={5} cols={6} />
      ) : error ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-red-800">{error}</p>
          <button
            onClick={onReload}
            className="btn-outline mt-3 px-4 py-1.5 text-xs text-brand-800"
          >
            Coba Muat Ulang
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <EmptyState
            title={hasActiveFilters ? "Tidak ada program yang cocok" : "Belum ada program terdaftar"}
            desc={
              hasActiveFilters
                ? "Coba ubah kata kunci pencarian atau bersihkan filter yang aktif."
                : "Mulai daftarkan program wakaf atau zakat baru agar tampil di listing publik."
            }
            action={
              hasActiveFilters ? (
                <button onClick={onResetFilters} className="btn-outline text-xs mt-3">
                  Bersihkan Filter
                </button>
              ) : (
                <button onClick={onOpenCreate} className="btn-primary text-xs mt-3">
                  + Tambah Program Baru
                </button>
              )
            }
          />
        </div>
      ) : (
        <>
          {/* BANNER NOTIFIKASI KOTAK SAMPAH */}
          {isTrashMode && (
            <div className="m-4 sm:m-5 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 flex items-start gap-3">
              <svg
                className="h-4 w-4 text-amber-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold text-amber-950">Kotak Sampah Program</p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Program di bawah ini telah disembunyikan dari portal publik. Anda dapat memulihkannya kembali atau menghapusnya secara permanen (hanya diizinkan jika belum pernah menerima transaksi donasi).
                </p>
              </div>
            </div>
          )}

          {/* DESKTOP DATA TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-950">
              <thead className="border-b border-brand-100 bg-brand-50/50 text-[11px] font-bold uppercase tracking-wider text-brand-600">
                <tr>
                  <th scope="col" className="pl-5 pr-2 py-3.5 w-10">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isSomeSelected}
                      onChange={onToggleSelectAll}
                      aria-label="Pilih semua program di halaman ini"
                    />
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Program & Lembaga
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Klasifikasi
                  </th>
                  <th scope="col" className="px-4 py-3.5 w-64">
                    Realisasi & Target
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-center">
                    Status Tayang
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Aksi Cepat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {items.map((p) => {
                  const pct = persen(p.terkumpul, p.target);
                  const isToggling = togglingId === p.id;
                  const isSelected = selectedIds.includes(p.id);
                  const visual = getCategoryVisual(p.kategori);

                  return (
                    <tr
                      key={p.id}
                      className={`group transition-colors ${
                        isSelected ? "bg-brand-50/70" : "hover:bg-brand-50/40"
                      }`}
                    >
                      <td className="pl-5 pr-2 py-4">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleSelect(p.id)}
                          aria-label={`Pilih program ${p.nama}`}
                        />
                      </td>

                      {/* 1. Program, Thumbnail & Lokasi */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3.5">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.nama}
                              className="h-12 w-12 rounded-2xl object-cover border border-brand-200/80 shadow-xs shrink-0"
                            />
                          ) : (
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.bg} shadow-xs shrink-0`}
                            >
                              {visual.icon}
                            </div>
                          )}

                          <div className="min-w-0">
                            <Link
                              href={`/program/${p.slug}`}
                              target="_blank"
                              className="font-semibold text-brand-950 hover:text-brand-600 transition line-clamp-1 text-sm group-hover:underline"
                              title={p.nama}
                            >
                              {p.nama}
                            </Link>

                            <div className="mt-1 flex items-center gap-2 text-xs text-brand-500">
                              <span className="inline-flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-brand-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span className="truncate max-w-[130px]">{p.lokasi}</span>
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-[150px] text-brand-400">{p.nazhir}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Klasifikasi */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20">
                            {(PROGRAM_TYPE_LABEL as Record<string, string>)[p.program_type] || p.program_type}
                          </span>
                          <CategoryBadge kategori={p.kategori} />
                        </div>
                      </td>

                      {/* 3. Capaian & Target */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="font-bold text-brand-950 font-sans">
                              {formatRupiah(p.terkumpul)}
                            </span>
                            <span className={`text-[11px] font-bold ${pct >= 100 ? "text-emerald-600" : "text-brand-600"}`}>
                              {pct}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                pct >= 100
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                  : "bg-gradient-to-r from-brand-500 to-brand-600"
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-brand-500">
                            <span>Target: {formatRupiah(p.target)}</span>
                            <span className="inline-flex items-center gap-1">
                              <svg className="h-3 w-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              {p.jumlahWakif} wakif
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Status Switch / Toggle Interaktif */}
                      <td className="px-4 py-4 text-center">
                        {isTrashMode ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 shadow-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            <span>Terhapus</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleActive(p)}
                            disabled={isToggling}
                            title={p.aktif ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                            className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                              p.aktif
                                ? "border border-emerald-200/80 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300"
                                : "border border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            {isToggling ? (
                              <Spinner className="h-2.5 w-2.5 text-brand-600" />
                            ) : (
                              <span className="relative flex h-2 w-2">
                                {p.aktif && (
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                )}
                                <span
                                  className={`relative inline-flex h-2 w-2 rounded-full ${
                                    p.aktif ? "bg-emerald-500" : "bg-zinc-400"
                                  }`}
                                />
                              </span>
                            )}
                            <span>{p.aktif ? "Aktif" : "Nonaktif"}</span>
                          </button>
                        )}
                      </td>

                      {/* 5. Aksi Cepat */}
                      <td className="px-5 py-4 text-right">
                        {isTrashMode ? (
                          <div className="flex items-center justify-end gap-2">
                            {/* Pulihkan */}
                            <button
                              type="button"
                              onClick={() => onRestore?.(p)}
                              disabled={restoringId === p.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                              title="Pulihkan program ke daftar aktif"
                            >
                              {restoringId === p.id ? (
                                <Spinner className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                              )}
                              <span>Pulihkan</span>
                            </button>

                            {/* Hapus Permanen */}
                            <button
                              type="button"
                              onClick={() => onDelete(p)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-700 shadow-2xs hover:bg-rose-50 hover:border-rose-300 hover:text-rose-900 transition cursor-pointer"
                              title="Hapus permanen dari database"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                              <span>Hapus Permanen</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1. Lihat Program Publik */}
                            <Link
                              href={`/program/${p.slug}`}
                              target="_blank"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-600 shadow-2xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950 transition"
                              title="Lihat halaman program (tab baru)"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </Link>

                            {/* 2. Salin Tautan Publik */}
                            <button
                              type="button"
                              onClick={() => onCopyLink(p.slug)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-600 shadow-2xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950 transition"
                              title="Salin tautan publik"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                              </svg>
                            </button>

                            {/* 3. Edit Program */}
                            <button
                              type="button"
                              onClick={() => onEdit(p)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-800 shadow-2xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950 transition"
                              title="Ubah data program"
                            >
                              <svg className="h-3.5 w-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                              <span>Edit</span>
                            </button>

                            {/* 4. Hapus Program */}
                            <button
                              type="button"
                              onClick={() => onDelete(p)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-400 shadow-2xs hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition"
                              title="Pindahkan ke kotak sampah"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="divide-y divide-brand-100 lg:hidden">
            {items.map((p) => {
              const pct = persen(p.terkumpul, p.target);
              const isToggling = togglingId === p.id;
              const isSelected = selectedIds.includes(p.id);
              const visual = getCategoryVisual(p.kategori);

              return (
                <div
                  key={p.id}
                  className={`p-4 space-y-3.5 transition-colors ${
                    isSelected ? "bg-brand-50/70" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="pt-2 shrink-0">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleSelect(p.id)}
                          aria-label={`Pilih program ${p.nama}`}
                        />
                      </div>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.nama}
                          className="h-11 w-11 rounded-xl object-cover border border-brand-200/80 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${visual.bg} shadow-xs shrink-0`}>
                          {visual.icon}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="badge bg-brand-50 text-brand-700 text-[10px]">
                            {(PROGRAM_TYPE_LABEL as Record<string, string>)[p.program_type] || p.program_type}
                          </span>
                          <CategoryBadge kategori={p.kategori} />
                        </div>
                        <h4 className="mt-1 font-semibold text-brand-950 text-sm leading-snug">
                          {p.nama}
                        </h4>
                      </div>
                    </div>

                    {/* Status Pill Mobile */}
                    {isTrashMode ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        <span>Terhapus</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleActive(p)}
                        disabled={isToggling}
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.aktif
                            ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20"
                            : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-500/20"
                        }`}
                      >
                        {isToggling ? (
                          <Spinner className="h-2.5 w-2.5" />
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.aktif ? "bg-emerald-500" : "bg-zinc-400"
                            }`}
                          />
                        )}
                        <span>{p.aktif ? "Aktif" : "Nonaktif"}</span>
                      </button>
                    )}
                  </div>

                  {/* Progress Card Mobile */}
                  <div className="space-y-1.5 rounded-2xl bg-brand-50/50 p-3.5 border border-brand-100">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-brand-950 font-sans">
                        {formatRupiah(p.terkumpul)}
                      </span>
                      <span className="text-brand-700 font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-200/50">
                      <div
                        className="h-full rounded-full bg-brand-600"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-brand-500">
                      <span>Target: {formatRupiah(p.target)}</span>
                      <span>{p.jumlahWakif} donatur</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-brand-400 truncate max-w-[180px]">
                      📍 {p.lokasi}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isTrashMode ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onRestore?.(p)}
                            disabled={restoringId === p.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                            title="Pulihkan program"
                          >
                            {restoringId === p.id ? (
                              <Spinner className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                              </svg>
                            )}
                            <span>Pulihkan</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(p)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-700 shadow-2xs hover:bg-rose-50 hover:border-rose-300 hover:text-rose-900 transition cursor-pointer"
                            title="Hapus permanen dari database"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            <span>Hapus Permanen</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* 1. Lihat Program Publik */}
                          <Link
                            href={`/program/${p.slug}`}
                            target="_blank"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-600 shadow-2xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950 transition"
                            title="Lihat halaman program"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </Link>

                          {/* 2. Salin Tautan Publik */}
                          <button
                            type="button"
                            onClick={() => onCopyLink(p.slug)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-600 shadow-2xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950 transition"
                            title="Salin tautan"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                          </button>

                          {/* 3. Edit Program */}
                          <button
                            type="button"
                            onClick={() => onEdit(p)}
                            className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-white px-2 py-1.5 text-xs font-semibold text-brand-800 shadow-2xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950 transition"
                            title="Ubah data program"
                          >
                            <svg className="h-3.5 w-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            <span>Edit</span>
                          </button>

                          {/* 4. Hapus Program */}
                          <button
                            type="button"
                            onClick={() => onDelete(p)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-400 shadow-2xs hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition"
                            title="Pindahkan ke kotak sampah"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ELEVATED PAGINATION FOOTER */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            startItem={startItem}
            endItem={endItem}
            limit={limit}
            itemName="program"
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        </>
      )}
    </div>
    </div>
  );
}
