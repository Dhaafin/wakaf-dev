"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api, ApiError } from "@/lib/api/client";
import { validateProgramForm } from "@/lib/validation";
import { useToast } from "@/lib/store/toast";
import type {
  Program,
  ProgramCategory,
  ProgramType,
  PaginatedResult,
} from "@/types";

export type AdminProgramSort = "latest" | "oldest" | "target_asc" | "target_desc";
export type AdminProgramStatusFilter = "all" | "active" | "inactive";

export function useAdminProgram() {
  const { push } = useToast();

  // --- Filter & Pagination State ---
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<AdminProgramStatusFilter>("all");
  const [selectedSort, setSelectedSort] = useState<AdminProgramSort>("latest");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // --- Data State ---
  const [data, setData] = useState<PaginatedResult<Program> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // --- Modal Form State (Create & Edit) ---
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formNama, setFormNama] = useState("");
  const [formType, setFormType] = useState<string>("wakaf-melalui-uang");
  const [formKategori, setFormKategori] = useState<string>("masjid");
  const [formLokasi, setFormLokasi] = useState("");
  const [formRingkasan, setFormRingkasan] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formTarget, setFormTarget] = useState<number | "">("");
  const [formNazhir, setFormNazhir] = useState("Nazhir Yayasan Khazanah Berkah Mulia");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch data
  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listPrograms({
        page,
        limit,
        q: debouncedSearch || undefined,
        type: selectedType || undefined,
        kategori: selectedKategori || undefined,
        status: selectedStatus,
        sort: selectedSort,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat program.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, selectedType, selectedKategori, selectedStatus, selectedSort]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Agregasi statistik dinamis dari data yang dimuat
  const items = data?.items ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const statsSummary = useMemo(() => {
    if (!items || items.length === 0) {
      return { activeCount: 0, totalTarget: 0, totalTerkumpul: 0, totalWakif: 0, avgPct: 0 };
    }
    const activeCount = items.filter((p) => p.aktif).length;
    const totalTarget = items.reduce((acc, p) => acc + (p.target || 0), 0);
    const totalTerkumpul = items.reduce((acc, p) => acc + (p.terkumpul || 0), 0);
    const totalWakif = items.reduce((acc, p) => acc + (p.jumlahWakif || 0), 0);
    const avgPct = totalTarget > 0 ? Math.round((totalTerkumpul / totalTarget) * 100) : 0;
    return { activeCount, totalTarget, totalTerkumpul, totalWakif, avgPct };
  }, [items]);

  // Cek apakah ada filter yang sedang aktif
  const hasActiveFilters = Boolean(
    debouncedSearch || selectedType || selectedKategori || selectedStatus !== "all" || selectedSort !== "latest",
  );

  function handleResetFilters() {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedType("");
    setSelectedKategori("");
    setSelectedStatus("all");
    setSelectedSort("latest");
    setPage(1);
  }

  // Quick action: Salin link publik ke clipboard
  function handleCopyLink(slug: string) {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/program/${slug}`;
    navigator.clipboard.writeText(url);
    push({
      kind: "info",
      title: "Tautan Disalin",
      desc: "Link publik program berhasil disalin ke clipboard.",
    });
  }

  // Toggle Program Active Status
  async function handleToggleActive(prog: Program) {
    setTogglingId(prog.id);
    const nextStatus = !prog.aktif;
    try {
      await api.updateProgram(prog.id, { aktif: nextStatus });
      push({
        kind: "success",
        title: nextStatus ? "Program Diaktifkan" : "Program Dinonaktifkan",
        desc: `Status program "${prog.nama}" telah diperbarui.`,
      });
      if (data) {
        setData({
          ...data,
          items: data.items.map((item) =>
            item.id === prog.id ? { ...item, aktif: nextStatus } : item,
          ),
        });
      }
    } catch (err) {
      push({
        kind: "error",
        title: "Gagal Mengubah Status",
        desc: err instanceof Error ? err.message : "Terjadi kesalahan.",
      });
    } finally {
      setTogglingId(null);
    }
  }

  // Modal Form Handlers (Create & Edit)
  function resetCreateForm() {
    setFormNama("");
    setFormType("wakaf-melalui-uang");
    setFormKategori("masjid");
    setFormLokasi("");
    setFormRingkasan("");
    setFormDeskripsi("");
    setFormImageUrl("");
    setFormTarget("");
    setFormNazhir("Nazhir Yayasan Khazanah Berkah Mulia");
    setFormErrors({});
  }

  function handleOpenCreate() {
    setEditingProgram(null);
    resetCreateForm();
    setIsCreateOpen(true);
  }

  function handleOpenEdit(prog: Program) {
    setEditingProgram(prog);
    setFormNama(prog.nama);
    setFormType(prog.program_type);
    setFormKategori(prog.kategori);
    setFormLokasi(prog.lokasi);
    setFormRingkasan(prog.ringkasan);
    setFormDeskripsi(prog.deskripsi);
    setFormImageUrl(prog.imageUrl || "");
    setFormTarget(prog.target);
    setFormNazhir(prog.nazhir || "Nazhir Yayasan Khazanah Berkah Mulia");
    setFormErrors({});
    setIsCreateOpen(true);
  }

  function handleCloseForm() {
    if (formSubmitting) return;
    setIsCreateOpen(false);
    setEditingProgram(null);
  }

  async function handleSubmitProgram(e: React.FormEvent) {
    e.preventDefault();
    const values = {
      nama: formNama,
      kategori: formKategori,
      lokasi: formLokasi,
      ringkasan: formRingkasan,
      deskripsi: formDeskripsi,
      imageUrl: formImageUrl,
      target: formTarget,
      nazhir: formNazhir,
    };

    const localErrors = validateProgramForm(values);
    setFormErrors(localErrors);
    if (Object.keys(localErrors).length > 0) return;

    setFormSubmitting(true);
    try {
      if (editingProgram) {
        // Mode Edit Program
        const updated = await api.updateProgram(editingProgram.id, {
          nama: formNama.trim(),
          program_type: formType,
          kategori: formKategori,
          lokasi: formLokasi.trim(),
          ringkasan: formRingkasan.trim(),
          deskripsi: formDeskripsi.trim(),
          imageUrl: formImageUrl.trim() || undefined,
          target: Number(formTarget),
          nazhir: formNazhir.trim(),
        });

        push({
          kind: "success",
          title: "Perubahan Disimpan",
          desc: `Program "${updated.nama}" berhasil diperbarui.`,
        });
      } else {
        // Mode Tambah Program Baru
        const created = await api.createProgram({
          nama: formNama.trim(),
          program_type: formType,
          kategori: formKategori,
          lokasi: formLokasi.trim(),
          ringkasan: formRingkasan.trim(),
          deskripsi: formDeskripsi.trim(),
          imageUrl: formImageUrl.trim() || undefined,
          target: Number(formTarget),
          nazhir: formNazhir.trim(),
        });

        push({
          kind: "success",
          title: "Program Baru Dibuat",
          desc: `"${created.nama}" berhasil didaftarkan ke sistem.`,
        });
      }

      resetCreateForm();
      setEditingProgram(null);
      setIsCreateOpen(false);
      fetchPrograms();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFormErrors(err.fieldErrors);
      }
      push({
        kind: "error",
        title: editingProgram ? "Gagal Memperbarui Program" : "Gagal Membuat Program",
        desc: err instanceof Error ? err.message : "Terjadi kesalahan.",
      });
    } finally {
      setFormSubmitting(false);
    }
  }

  // --- Delete Confirmation State ---
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  function handleOpenDelete(prog: Program) {
    setProgramToDelete(prog);
  }

  function handleCloseDelete() {
    if (isDeleting) return;
    setProgramToDelete(null);
  }

  async function handleConfirmDelete() {
    if (!programToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteProgram(programToDelete.id);
      push({
        kind: "success",
        title: "Program Dihapus",
        desc: `"${programToDelete.nama}" berhasil dihapus dari sistem.`,
      });
      setProgramToDelete(null);
      fetchPrograms();
    } catch (err) {
      push({
        kind: "error",
        title: "Gagal Menghapus Program",
        desc:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menghapus program.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  // --- Multiple Selection & Bulk Delete State ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState<boolean>(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  const isAllSelected = useMemo(() => {
    return items.length > 0 && items.every((p) => selectedIds.includes(p.id));
  }, [items, selectedIds]);

  const isSomeSelected = useMemo(() => {
    return items.some((p) => selectedIds.includes(p.id)) && !isAllSelected;
  }, [items, selectedIds, isAllSelected]);

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleToggleSelectAll() {
    const pageIds = items.map((p) => p.id);
    if (pageIds.length === 0) return;

    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  }

  function handleClearSelection() {
    setSelectedIds([]);
  }

  function handleOpenBulkDelete() {
    if (selectedIds.length > 0) {
      setIsBulkDeleteOpen(true);
    }
  }

  function handleCloseBulkDelete() {
    if (isBulkDeleting) return;
    setIsBulkDeleteOpen(false);
  }

  async function handleConfirmBulkDelete() {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const res = await api.deletePrograms(selectedIds);
      push({
        kind: "success",
        title: "Program Berhasil Dihapus",
        desc: `${res.count} program terpilih telah dihapus dari sistem.`,
      });
      setSelectedIds([]);
      setIsBulkDeleteOpen(false);
      fetchPrograms();
    } catch (err) {
      push({
        kind: "error",
        title: "Gagal Menghapus Massal",
        desc:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menghapus program terpilih.",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  }

  return {
    // Filters & Pagination
    searchInput,
    setSearchInput,
    debouncedSearch,
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
    data,
    items,
    total,
    totalPages,
    startItem,
    endItem,
    loading,
    error,
    refetch: fetchPrograms,
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

    // Form Modal (Create & Edit)
    isCreateOpen,
    setIsCreateOpen,
    editingProgram,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmitProgram,
    handleCreateProgram: handleSubmitProgram,
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
  };
}

export type UseAdminProgramReturn = ReturnType<typeof useAdminProgram>;
