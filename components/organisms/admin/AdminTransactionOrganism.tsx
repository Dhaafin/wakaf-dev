"use client";

import { useAdminTransaction } from "@/hooks/useAdminTransaction";
import { AdminPageHeader } from "@/components/molecules/AdminPageHeader";
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
      {/* 1. REUSABLE EXECUTIVE HEADER */}
      <AdminPageHeader
        title="Transaksi Masuk & Audit Wakaf"
        description="Pantau seluruh aliran dana masuk dari para wakif, periksa keabsahan status transaksi Virtual Account / Midtrans, dan kelola arsip donasi secara transparan."
        onRefresh={() => refetch()}
        refreshing={loading}
      />

      {/* 2. KARTU KPI METRIK RINGKASAN EKSEKUTIF */}
      <AdminTransactionKpiCards
        statsSummary={statsSummary}
        loading={loading}
      />

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
