"use client";

import { useAdminDisbursement } from "@/hooks/useAdminDisbursement";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AdminPageHeader } from "@/components/molecules/AdminPageHeader";
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
      {/* 1. REUSABLE EXECUTIVE HEADER */}
      <AdminPageHeader
        title="Penyaluran Dana & Transparansi"
        description="Pantau realisasi penyaluran dana wakaf & zakat secara akuntabel, kelola arsip kuitansi sah, dan pertanggungjawabkan amanah para wakif ke publik."
        onRefresh={() => refetch()}
        refreshing={loading}
        refreshLabel="Muat Ulang"
        actions={
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
        }
      />

      {/* 2. EXECUTIVE KPI SUMMARY CARDS */}
      <AdminDisbursementKpiCards
        statsSummary={statsSummary}
        loading={loading}
      />

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
