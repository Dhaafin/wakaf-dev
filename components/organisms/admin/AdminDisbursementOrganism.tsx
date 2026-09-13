"use client";

import { useAdminDisbursement } from "@/hooks/useAdminDisbursement";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import {
  AdminDisbursementKpiCards,
  AdminDisbursementFilterBar,
  AdminDisbursementTable,
  AdminDisbursementCreateModal,
  AdminDisbursementReceiptModal,
} from "./disbursement";

export function AdminDisbursementOrganism() {
  const {
    // Filters & Pagination
    searchInput,
    setSearchInput,
    selectedProgramId,
    setSelectedProgramId,
    selectedSort,
    setSelectedSort,
    page,
    setPage,
    limit,
    setLimit,
    hasActiveFilters,
    handleResetFilters,

    // Data & KPIs
    items,
    total,
    totalPages,
    startItem,
    endItem,
    statsSummary,
    loading,
    error,
    refetch,
    programs,

    // Create Modal Form
    isCreateOpen,
    handleOpenCreate,
    handleCloseCreate,
    formProgramId,
    setFormProgramId,
    formJudul,
    setFormJudul,
    formDeskripsi,
    setFormDeskripsi,
    formNominal,
    setFormNominal,
    formBuktiImageUrl,
    setFormBuktiImageUrl,
    formBuktiFileName,
    setFormBuktiFileName,
    formErrors,
    formSubmitting,
    selectedFormProgram,
    handleSubmitDisbursement,

    // Receipt Preview Modal
    previewItem,
    handleOpenPreview,
    handleClosePreview,

    // Delete Confirmation
    itemToDelete,
    isDeleting,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  } = useAdminDisbursement();

  return (
    <div className="animate-fade-in space-y-6">
      {/* 1. EXECUTIVE HEADER DENGAN AKSEN VISUAL */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-8 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="pointer-events-none absolute right-24 -bottom-16 h-48 w-48 rounded-full bg-accent-500/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Penyaluran Dana & Transparansi
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-brand-200/90 leading-relaxed">
              Pantau realisasi penyaluran dana wakaf & zakat secara akuntabel, kelola arsip kuitansi sah, dan pertanggungjawabkan amanah para wakif ke publik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Perbarui data"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin text-brand-300" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span>Muat Ulang</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreate()}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-xs font-bold text-brand-950 shadow-md transition hover:bg-accent-400 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Catat Penyaluran</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI SUMMARY CARDS */}
      <AdminDisbursementKpiCards statsSummary={statsSummary} />

      {/* 3. SEARCH & REFINED FILTER CONSOLE */}
      <AdminDisbursementFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        selectedProgramId={selectedProgramId}
        onProgramChange={setSelectedProgramId}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        programs={programs}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. DATA TABLE & PAGINATION */}
      <AdminDisbursementTable
        loading={loading}
        error={error}
        items={items}
        total={total}
        totalPages={totalPages}
        page={page}
        limit={limit}
        startItem={startItem}
        endItem={endItem}
        hasActiveFilters={hasActiveFilters}
        onPreviewReceipt={handleOpenPreview}
        onDelete={handleOpenDelete}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onResetFilters={handleResetFilters}
        onOpenCreate={() => handleOpenCreate()}
        onReload={refetch}
      />

      {/* 5. MODAL CATAT PENYALURAN DANA */}
      <AdminDisbursementCreateModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        programs={programs}
        selectedProgram={selectedFormProgram}
        formProgramId={formProgramId}
        onProgramIdChange={setFormProgramId}
        formJudul={formJudul}
        onJudulChange={setFormJudul}
        formDeskripsi={formDeskripsi}
        onDeskripsiChange={setFormDeskripsi}
        formNominal={formNominal}
        onNominalChange={setFormNominal}
        formBuktiImageUrl={formBuktiImageUrl}
        onBuktiImageUrlChange={setFormBuktiImageUrl}
        formBuktiFileName={formBuktiFileName}
        onBuktiFileNameChange={setFormBuktiFileName}
        formErrors={formErrors}
        formSubmitting={formSubmitting}
        onSubmit={handleSubmitDisbursement}
      />

      {/* 6. MODAL PRATINJAU BUKTI & KUITANSI */}
      <AdminDisbursementReceiptModal
        item={previewItem}
        isOpen={Boolean(previewItem)}
        onClose={handleClosePreview}
      />

      {/* 7. MODAL KONFIRMASI HAPUS PENYALURAN */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Hapus Laporan Penyaluran?"
        description="Apakah Anda yakin ingin menghapus catatan penyaluran ini? Data transaksi buku kas dan kuitansi terkait akan dihapus dari sistem."
        itemName={itemToDelete?.judul}
        confirmText="Ya, Hapus Penyaluran"
        cancelText="Batal"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
