"use client";

import { useAdminProgram } from "@/hooks/useAdminProgram";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
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
    formErrors,
    formSubmitting,
    resetCreateForm,
    handleCreateProgram,
  } = useAdminProgram();

  return (
    <div className="animate-fade-in space-y-6">
      {/* 1. EXECUTIVE HEADER DENGAN AKSEN VISUAL */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-8 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="pointer-events-none absolute right-24 -bottom-16 h-48 w-48 rounded-full bg-accent-500/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Kelola Portofolio Program
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-brand-200/90 leading-relaxed">
              Pantau progres dana secara komprehensif, kelola instrumen wakaf & zakat, serta kendalikan status tayang kampanye di portal publik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95 disabled:opacity-50"
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
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-xs font-bold text-brand-950 shadow-md transition hover:bg-accent-400 hover:shadow-lg active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Tambah Program</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI SUMMARY STRIP */}
      <AdminProgramKpiCards total={total} statsSummary={statsSummary} />

      {/* 3. SEARCH & REFINED FILTER CONSOLE */}
      <AdminProgramFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        total={total}
        activeCount={statsSummary.activeCount}
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
        onOpenCreate={() => setIsCreateOpen(true)}
        onReload={refetch}
      />

      {/* 5. MODAL TAMBAH PROGRAM */}
      <AdminProgramCreateModal
        isOpen={isCreateOpen}
        onClose={() => {
          resetCreateForm();
          setIsCreateOpen(false);
        }}
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
        onSubmit={handleCreateProgram}
      />

      {/* 6. MODAL KONFIRMASI HAPUS PROGRAM */}
      <ConfirmModal
        isOpen={Boolean(programToDelete)}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Hapus Program Wakaf?"
        description="Apakah Anda yakin ingin menghapus program ini? Data kampanye akan dinonaktifkan dan dihapus dari portal publik Yayasan KBM."
        itemName={programToDelete?.nama}
        confirmText="Ya, Hapus Program"
        cancelText="Batal"
        loading={isDeleting}
        variant="danger"
      />

      {/* 7. MODAL KONFIRMASI HAPUS MASSAL (BULK DELETE) */}
      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={handleCloseBulkDelete}
        onConfirm={handleConfirmBulkDelete}
        title={`Hapus ${selectedIds.length} Program Sekaligus?`}
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.length} program terpilih? Semua data kampanye ini akan dinonaktifkan dan dihapus dari portal publik.`}
        confirmText={`Ya, Hapus Semua (${selectedIds.length})`}
        cancelText="Batal"
        loading={isBulkDeleting}
        variant="danger"
      />
    </div>
  );
}
