import type { DisbursementWithProgram } from "@/types";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { Pagination } from "@/components/molecules/Pagination";
import { formatRupiah, formatTanggal } from "@/lib/format";

export interface AdminDisbursementTableProps {
  loading: boolean;
  error: string | null;
  items: DisbursementWithProgram[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  startItem: number;
  endItem: number;
  hasActiveFilters: boolean;
  onPreviewReceipt: (item: DisbursementWithProgram) => void;
  onDelete: (item: DisbursementWithProgram) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onResetFilters: () => void;
  onOpenCreate: () => void;
  onReload: () => void;
}

export function AdminDisbursementTable({
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
  onPreviewReceipt,
  onDelete,
  onPageChange,
  onLimitChange,
  onResetFilters,
  onOpenCreate,
  onReload,
}: AdminDisbursementTableProps) {
  return (
    <div className="rounded-2xl border border-brand-200/90 bg-white shadow-xs overflow-hidden">
      {/* 1. STATE: ERROR */}
      {error && !loading && (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-200">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-950">
            Terjadi Masalah Saat Memuat Laporan Penyaluran
          </p>
          <p className="mt-1 text-xs text-brand-500">{error}</p>
          <button
            type="button"
            onClick={onReload}
            className="btn-outline mt-4 py-2 px-4 text-xs cursor-pointer"
          >
            Coba Muat Ulang
          </button>
        </div>
      )}

      {/* 2. STATE: LOADING SKELETON */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Spinner className="h-8 w-8 text-brand-600" />
          <p className="mt-3 text-xs font-semibold text-brand-700">
            Memuat data realisasi penyaluran...
          </p>
        </div>
      )}

      {/* 3. STATE: EMPTY RESULT */}
      {!loading && !error && items.length === 0 && (
        <div className="p-8">
          <EmptyState
            title={
              hasActiveFilters
                ? "Tidak ada laporan penyaluran yang cocok"
                : "Belum ada laporan penyaluran dana"
            }
            desc={
              hasActiveFilters
                ? "Cobalah mengubah kata kunci pencarian atau reset filter program Anda."
                : "Catat bukti penyaluran pertama untuk meningkatkan transparansi laporan publik."
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="btn-outline py-2 px-4 text-xs cursor-pointer"
                >
                  Reset Filter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenCreate}
                  className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span>Catat Penyaluran Dana</span>
                </button>
              )
            }
          />
        </div>
      )}

      {/* 4. STATE: DATA TABLE (DESKTOP) */}
      {!loading && !error && items.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-200/80 bg-brand-50/60 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  <th className="py-3.5 px-4 w-20 text-center">Bukti</th>
                  <th className="py-3.5 px-4">Program</th>
                  <th className="py-3.5 px-4">Rincian Realisasi</th>
                  <th className="py-3.5 px-4 w-32">Tanggal</th>
                  <th className="py-3.5 px-4 w-36 text-right">Nominal</th>
                  <th className="py-3.5 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/70">
                {items.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-brand-50/40 group"
                    >
                      {/* Bukti / Kuitansi Thumbnail */}
                      <td className="py-3 px-4 text-center">
                        {item.buktiImageUrl ? (
                          <button
                            type="button"
                            onClick={() => onPreviewReceipt(item)}
                            className="group/img relative inline-block h-12 w-12 overflow-hidden rounded-xl border border-brand-200 bg-brand-50 shadow-2xs transition hover:ring-2 hover:ring-accent-500 cursor-pointer"
                            title="Klik untuk pratinjau bukti"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.buktiImageUrl}
                              alt={item.judul}
                              className="h-full w-full object-cover transition duration-200 group-hover/img:scale-110"
                            />
                            <div className="absolute inset-0 bg-brand-950/20 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center">
                              <svg
                                className="h-4 w-4 text-white drop-shadow"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                                />
                              </svg>
                            </div>
                          </button>
                        ) : (
                          <div
                            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-brand-200 bg-brand-50/60 text-brand-300"
                            title="Tidak ada berkas bukti"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </td>

                      {/* Program & Kategori */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-brand-950 line-clamp-1 max-w-xs">
                          {item.program?.nama || "Program Khusus"}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          {item.program?.kategori && (
                            <CategoryBadge kategori={item.program.kategori} />
                          )}
                          <span className="text-[10px] text-brand-400 font-mono">
                            {item.programId}
                          </span>
                        </div>
                      </td>

                      {/* Judul & Rincian */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-brand-950 text-xs">
                          {item.judul}
                        </p>
                        <p className="text-[11px] text-brand-500 line-clamp-2 mt-0.5 max-w-sm">
                          {item.deskripsi}
                        </p>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3 px-4 text-brand-600 font-medium">
                        {formatTanggal(item.tanggal)}
                      </td>

                      {/* Nominal */}
                      <td className="py-3 px-4 text-right">
                        <span className="inline-block font-bold text-brand-950 bg-accent-50 text-accent-950 px-2.5 py-1 rounded-lg border border-accent-200/60 font-sans">
                          {formatRupiah(item.nominal)}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Tombol Preview Bukti */}
                          <button
                            type="button"
                            onClick={() => onPreviewReceipt(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-600 shadow-2xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950 transition cursor-pointer"
                            title="Lihat Detail & Bukti"
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
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-200 bg-white text-brand-400 shadow-2xs hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                            title="Hapus Laporan"
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
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. RESPONSIVE MOBILE CARDS (SMALL SCREEN) */}
          <div className="md:hidden divide-y divide-brand-100 p-3 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-brand-200/80 bg-white p-4 space-y-3 pt-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  {item.buktiImageUrl ? (
                    <button
                      type="button"
                      onClick={() => onPreviewReceipt(item)}
                      className="shrink-0 h-16 w-16 overflow-hidden rounded-xl border border-brand-200 bg-brand-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.buktiImageUrl}
                        alt={item.judul}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ) : (
                    <div className="shrink-0 h-16 w-16 flex items-center justify-center rounded-xl border border-dashed border-brand-200 bg-brand-50/60 text-brand-300">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-950 line-clamp-1">
                      {item.judul}
                    </p>
                    <p className="text-[11px] text-brand-500 line-clamp-1 mt-0.5">
                      {item.program?.nama}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="font-bold text-xs text-accent-900 bg-accent-50 border border-accent-200/60 px-2 py-0.5 rounded-md">
                        {formatRupiah(item.nominal)}
                      </span>
                      <span className="text-[10px] text-brand-400">
                        {formatTanggal(item.tanggal)}
                      </span>
                    </div>
                  </div>
                </div>

                {item.deskripsi && (
                  <p className="text-xs text-brand-600 bg-brand-50/50 p-2.5 rounded-lg border border-brand-100/60 leading-relaxed">
                    {item.deskripsi}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-100/60">
                  <button
                    type="button"
                    onClick={() => onPreviewReceipt(item)}
                    className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-1 cursor-pointer"
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
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Detail Bukti</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 6. ELEVATED PAGINATION FOOTER */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            startItem={startItem}
            endItem={endItem}
            limit={limit}
            itemName="penyaluran"
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        </>
      )}
    </div>
  );
}
