"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api, ApiError } from "@/lib/api/client";
import { validateDisbursementForm } from "@/lib/validation";
import { useToast } from "@/lib/store/toast";
import type {
  Program,
  DisbursementWithProgram,
  DisbursementStatsSummary,
} from "@/types";

export type AdminDisbursementSort =
  | "latest"
  | "oldest"
  | "nominal_desc"
  | "nominal_asc";

export function useAdminDisbursement() {
  const { push } = useToast();

  // --- Filter & Pagination State ---
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [selectedSort, setSelectedSort] =
    useState<AdminDisbursementSort>("latest");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // --- Data State ---
  const [items, setItems] = useState<DisbursementWithProgram[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statsSummary, setStatsSummary] = useState<DisbursementStatsSummary>({
    totalNominal: 0,
    totalCount: 0,
    programCount: 0,
    avgNominal: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Daftar seluruh program untuk dropdown pilihan
  const [programs, setPrograms] = useState<Program[]>([]);

  // --- Create Modal Form State ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formProgramId, setFormProgramId] = useState("");
  const [formJudul, setFormJudul] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formNominal, setFormNominal] = useState<number | "">("");
  const [formBuktiImageUrl, setFormBuktiImageUrl] = useState("");
  const [formBuktiFileName, setFormBuktiFileName] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // --- Receipt Lightbox Modal State ---
  const [previewItem, setPreviewItem] =
    useState<DisbursementWithProgram | null>(null);

  // --- Delete Confirmation State ---
  const [itemToDelete, setItemToDelete] =
    useState<DisbursementWithProgram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load programs list (untuk dropdown program)
  const fetchProgramsList = useCallback(async () => {
    try {
      const res = await api.listPrograms({ limit: 100, status: "all" });
      setPrograms(res.items);
    } catch {
      // Non-critical, fallback to empty
    }
  }, []);

  useEffect(() => {
    fetchProgramsList();
  }, [fetchProgramsList]);

  // Fetch disbursements list
  const fetchDisbursements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listDisbursements({
        page,
        limit,
        q: debouncedSearch || undefined,
        programId: selectedProgramId || undefined,
        sort: selectedSort,
      });
      setItems(res.items);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
      setStatsSummary(res.statsSummary);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat laporan penyaluran dana.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, selectedProgramId, selectedSort]);

  useEffect(() => {
    fetchDisbursements();
  }, [fetchDisbursements]);

  // Perhitungan item start & end
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Cek apakah filter sedang aktif
  const hasActiveFilters = Boolean(
    searchInput.trim() || selectedProgramId || selectedSort !== "latest",
  );

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedProgramId("");
    setSelectedSort("latest");
    setPage(1);
  }, []);

  // Program yang sedang dipilih di form
  const selectedFormProgram = useMemo(
    () => programs.find((p) => p.id === formProgramId),
    [programs, formProgramId],
  );

  // --- Handlers: Modal Create ---
  const handleOpenCreate = useCallback((defaultProgId?: string) => {
    setFormProgramId(defaultProgId || "");
    setFormJudul("");
    setFormDeskripsi("");
    setFormNominal("");
    setFormBuktiImageUrl("");
    setFormBuktiFileName("");
    setFormErrors({});
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
    setFormErrors({});
  }, []);

  const handleSubmitDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProgramId) {
      setFormErrors({ programId: "Pilih program terlebih dahulu." });
      return;
    }

    const values = {
      judul: formJudul,
      deskripsi: formDeskripsi,
      nominal: formNominal,
      buktiImageUrl: formBuktiImageUrl,
      buktiFileName: formBuktiFileName,
    };

    const localErrors = validateDisbursementForm(values);
    setFormErrors(localErrors);
    if (Object.keys(localErrors).length > 0) return;

    setFormSubmitting(true);
    try {
      await api.createDisbursement({
        programId: formProgramId,
        judul: formJudul.trim(),
        deskripsi: formDeskripsi.trim(),
        nominal: Number(formNominal),
        buktiImageUrl: formBuktiImageUrl.trim() || undefined,
        buktiFileName: formBuktiFileName.trim() || undefined,
      });

      push({
        kind: "success",
        title: "Penyaluran Berhasil Dicatat",
        desc: "Laporan penyaluran dana telah tersimpan dan diperbarui di portal publik.",
      });

      handleCloseCreate();
      fetchDisbursements();
      fetchProgramsList();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFormErrors(err.fieldErrors);
      }
      push({
        kind: "error",
        title: "Gagal Menyimpan",
        desc:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menyimpan laporan.",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // --- Handlers: Receipt Preview Modal ---
  const handleOpenPreview = useCallback((item: DisbursementWithProgram) => {
    setPreviewItem(item);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewItem(null);
  }, []);

  // --- Handlers: Delete Confirmation ---
  const handleOpenDelete = useCallback((item: DisbursementWithProgram) => {
    setItemToDelete(item);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setItemToDelete(null);
  }, []);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteDisbursement(itemToDelete.id);
      push({
        kind: "success",
        title: "Laporan Dihapus",
        desc: `Laporan "${itemToDelete.judul}" berhasil dihapus.`,
      });
      handleCloseDelete();
      fetchDisbursements();
      fetchProgramsList();
    } catch (err) {
      push({
        kind: "error",
        title: "Gagal Menghapus",
        desc:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menghapus laporan.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
    refetch: fetchDisbursements,
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
  };
}
