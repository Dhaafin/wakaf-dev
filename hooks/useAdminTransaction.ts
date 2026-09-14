"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/store/toast";
import type {
  Transaction,
  TransactionStatus,
  TransactionStatsSummary,
  Program,
} from "@/types";

export type AdminTransactionSort =
  | "latest"
  | "oldest"
  | "nominal_desc"
  | "nominal_asc";

export function useAdminTransaction() {
  const { push } = useToast();

  // --- Filter & Pagination State ---
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | TransactionStatus>("all");
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<AdminTransactionSort>("latest");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // --- Data State ---
  const [items, setItems] = useState<Transaction[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statsSummary, setStatsSummary] = useState<TransactionStatsSummary>({
    totalNominal: 0,
    totalCount: 0,
    paidCount: 0,
    pendingCount: 0,
    expiredCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Daftar seluruh program untuk filter dropdown
  const [programs, setPrograms] = useState<Program[]>([]);

  // Detail Modal State
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Debounce input pencarian (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load programs list untuk filter program
  const fetchProgramsList = useCallback(async () => {
    try {
      const res = await api.listPrograms({ limit: 100, status: "all" });
      setPrograms(res.items);
    } catch {
      // Non-critical
    }
  }, []);

  useEffect(() => {
    fetchProgramsList();
  }, [fetchProgramsList]);

  // Fetch transactions list dari API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listTransactions({
        page,
        limit,
        q: debouncedSearch || undefined,
        status: selectedStatus,
        programId: selectedProgramId || undefined,
        sort: selectedSort,
      });

      setItems(res.items);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
      setStatsSummary(res.statsSummary);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat daftar transaksi.";
      setError(msg);
      push({
        kind: "error",
        title: "Gagal Memuat Transaksi",
        desc: msg,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, selectedStatus, selectedProgramId, selectedSort, push]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Status apakah ada filter aktif
  const hasActiveFilters = useMemo(() => {
    return (
      Boolean(searchInput.trim()) ||
      selectedStatus !== "all" ||
      Boolean(selectedProgramId) ||
      selectedSort !== "latest"
    );
  }, [searchInput, selectedStatus, selectedProgramId, selectedSort]);

  // Reset semua filter ke default
  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedStatus("all");
    setSelectedProgramId("");
    setSelectedSort("latest");
    setPage(1);
  }, []);

  // Handler perubahan status
  const handleStatusChange = useCallback((status: "all" | TransactionStatus) => {
    setSelectedStatus(status);
    setPage(1);
  }, []);

  // Handler perubahan program
  const handleProgramChange = useCallback((programId: string) => {
    setSelectedProgramId(programId);
    setPage(1);
  }, []);

  // Handler perubahan urutan
  const handleSortChange = useCallback((sort: AdminTransactionSort) => {
    setSelectedSort(sort);
    setPage(1);
  }, []);

  // Hitung startItem dan endItem untuk teks pagination
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return {
    // Filter & Pagination
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
    refetch: fetchTransactions,
    programs,

    // Detail Modal
    selectedTransaction,
    setSelectedTransaction,
  };
}
