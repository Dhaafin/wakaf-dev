"use client";

import { useAdminTransaction } from "@/hooks/useAdminTransaction";
import {
  AdminTransactionKpiCards,
  AdminTransactionFilterBar,
  AdminTransactionTable,
  AdminTransactionDetailModal,
} from "./transaction";

export function AdminTransactionOrganism() {
  const {
    // Filters & Pagination
    searchInput,
    setSearchInput,
    selectedStatus,
    handleStatusChange,
    selectedProgramId,
    handleProgramChange,
    selectedSort,
    handleSortChange,
    page,
    setPage,
    limit,
    setLimit,
    hasActiveFilters,
    handleResetFilters,

    // Data & KPI
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

    // Detail Modal
    selectedTransaction,
    setSelectedTransaction,
  } = useAdminTransaction();

  return (
    <div className="animate-fade-in space-y-6">
      {/* 1. EXECUTIVE HEADER DENGAN AKSEN VISUAL */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-8 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="pointer-events-none absolute right-24 -bottom-16 h-48 w-48 rounded-full bg-accent-500/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Transaksi Masuk & Audit Wakaf
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-brand-200/90 leading-relaxed">
              Pantau seluruh aliran dana masuk dari para wakif, periksa keabsahan status transaksi Virtual Account / Midtrans, dan kelola arsip donasi secara transparan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-white/20 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Perbarui data transaksi"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
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
              <span>{loading ? "Menyegarkan..." : "Segarkan"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KARTU KPI METRIK RINGKASAN EKSEKUTIF */}
      <AdminTransactionKpiCards statsSummary={statsSummary} />

      {/* 3. TOOLBAR FILTER & SEARCH */}
      <AdminTransactionFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedProgramId={selectedProgramId}
        onProgramChange={handleProgramChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        programs={programs}
        statsSummary={statsSummary}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. TABEL TRANSAKSI & PAGINATION */}
      <AdminTransactionTable
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
        onSelectTransaction={(tx) => setSelectedTransaction(tx)}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onResetFilters={handleResetFilters}
        onReload={refetch}
      />

      {/* 5. MODAL DETAIL TRANSAKSI */}
      <AdminTransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
