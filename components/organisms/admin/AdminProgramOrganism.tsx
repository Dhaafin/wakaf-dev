"use client";

import { useAdminProgram } from "@/hooks/useAdminProgram";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { AdminPageHeader } from "@/components/molecules/AdminPageHeader";
import {
  AdminProgramKpiCards,
  AdminProgramFilterBar,
  AdminProgramTable,
  AdminProgramCreateModal,
} from "./program";

export function AdminProgramOrganism() {
  const {
    // Filters & Pagination
    searchInput,
    setSearchInput,
    selectedType,
    setSelectedType,
    selectedKategori,
    setSelectedKategori,
    selectedStatus,
    setSelectedStatus,
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
    loading,
    error,
    refetch,
    statsSummary,

    // Item Actions
    togglingId,
    handleToggleActive,
    handleCopyLink,
    handleRestore,
    restoringId,
    isTrashMode,
    deletedCount,

    // Delete Confirmation Modal
    programToDelete,
    isDeleting,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,

    // Multiple Selection & Bulk Delete
    selectedIds,
    isAllSelected,
    isSomeSelected,
    isBulkDeleteOpen,
    isBulkDeleting,
    handleToggleSelect,
    handleToggleSelectAll,
    handleClearSelection,
    handleOpenBulkDelete,
    handleCloseBulkDelete,
    handleConfirmBulkDelete,

    // Create Modal Form
    isCreateOpen,
    setIsCreateOpen,
    formNama,
    setFormNama,
    formType,
    setFormType,
    formKategori,
    setFormKategori,
    formLokasi,
    setFormLokasi,
    formRingkasan,
    setFormRingkasan,
    formDeskripsi,
    setFormDeskripsi,
    formImageUrl,
    setFormImageUrl,
    formTarget,
    setFormTarget,
    formNazhir,
    setFormNazhir,
    editingProgram,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmitProgram,
    formErrors,
    formSubmitting,
    resetCreateForm,
  } = useAdminProgram();

  return (
    <div className="animate-fade-in space-y-6">
      {/* 1. REUSABLE EXECUTIVE HEADER */}
      <AdminPageHeader
        title="Kelola Portofolio Program"
        description="Pantau progres dana secara komprehensif, kelola instrumen wakaf & zakat, serta kendalikan status tayang kampanye di portal publik."
        onRefresh={() => refetch()}
        refreshing={loading}
        refreshLabel="Muat Ulang"
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-xs font-bold text-brand-950 shadow-md transition hover:bg-accent-400 hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Tambah Program</span>
          </button>
        }
      />

      {/* 2. EXECUTIVE KPI SUMMARY STRIP */}
      <AdminProgramKpiCards
        total={total}
        statsSummary={statsSummary}
        loading={loading}
      />

      {/* 3. SEARCH & REFINED FILTER CONSOLE */}
      <AdminProgramFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        total={total}
        activeCount={statsSummary.activeCount}
        inactiveCount={statsSummary.inactiveCount}
        deletedCount={deletedCount}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedKategori={selectedKategori}
        onKategoriChange={setSelectedKategori}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. DATA TABLE & PAGINATION */}
      <AdminProgramTable
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
        togglingId={togglingId}
        onToggleActive={handleToggleActive}
        onCopyLink={handleCopyLink}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onOpenBulkDelete={handleOpenBulkDelete}
        onClearSelection={handleClearSelection}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onResetFilters={handleResetFilters}
        onOpenCreate={handleOpenCreate}
        onReload={refetch}
        isTrashMode={isTrashMode}
        onRestore={handleRestore}
        restoringId={restoringId}
      />

      {/* 5. MODAL TAMBAH / UBAH PROGRAM */}
      <AdminProgramCreateModal
        isOpen={isCreateOpen}
        onClose={handleCloseForm}
        mode={editingProgram ? "edit" : "create"}
        formNama={formNama}
        onNamaChange={setFormNama}
        formType={formType}
        onTypeChange={setFormType}
        formKategori={formKategori}
        onKategoriChange={setFormKategori}
        formLokasi={formLokasi}
        onLokasiChange={setFormLokasi}
        formRingkasan={formRingkasan}
        onRingkasanChange={setFormRingkasan}
        formDeskripsi={formDeskripsi}
        onDeskripsiChange={setFormDeskripsi}
        formImageUrl={formImageUrl}
        onImageUrlChange={setFormImageUrl}
        formTarget={formTarget}
        onTargetChange={setFormTarget}
        formNazhir={formNazhir}
        onNazhirChange={setFormNazhir}
        formErrors={formErrors}
        formSubmitting={formSubmitting}
        onSubmit={handleSubmitProgram}
      />

      {/* 6. MODAL KONFIRMASI HAPUS PROGRAM */}
      <ConfirmModal
        isOpen={Boolean(programToDelete)}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title={
          isTrashMode
            ? "Hapus Program Secara Permanen?"
            : "Pindahkan Program ke Kotak Sampah?"
        }
        description={
          isTrashMode
            ? "Peringatan: Program ini akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan (hanya diperbolehkan jika belum ada transaksi wakaf/keuangan terkait)."
            : "Apakah Anda yakin ingin menghapus program ini? Program akan disembunyikan dari portal publik dan dipindahkan ke kotak sampah."
        }
        itemName={programToDelete?.nama}
        confirmText={isTrashMode ? "Ya, Hapus Permanen" : "Pindahkan ke Sampah"}
        cancelText="Batal"
        loading={isDeleting}
        variant="danger"
      />

      {/* 7. MODAL KONFIRMASI HAPUS MASSAL (BULK DELETE) */}
      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={handleCloseBulkDelete}
        onConfirm={handleConfirmBulkDelete}
        title={
          isTrashMode
            ? `Hapus Permanen ${selectedIds.length} Program Sekaligus?`
            : `Hapus ${selectedIds.length} Program Sekaligus?`
        }
        description={
          isTrashMode
            ? `Peringatan: ${selectedIds.length} program terpilih akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan (hanya diperbolehkan jika belum ada transaksi wakaf/keuangan terkait).`
            : `Apakah Anda yakin ingin menghapus ${selectedIds.length} program terpilih? Semua data kampanye ini akan dinonaktifkan dan dipindahkan ke kotak sampah.`
        }
        confirmText={
          isTrashMode
            ? `Ya, Hapus Permanen (${selectedIds.length})`
            : `Ya, Hapus Semua (${selectedIds.length})`
        }
        cancelText="Batal"
        loading={isBulkDeleting}
        variant="danger"
      />
    </div>
  );
}
