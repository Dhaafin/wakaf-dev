"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api/client";
import { formatRupiah, persen } from "@/lib/format";
import { validateProgramForm } from "@/lib/validation";
import {
  PROGRAM_CATEGORY_LABEL,
  PROGRAM_TYPE_LABEL,
  type Program,
  type ProgramCategory,
  type ProgramType,
  type PaginatedResult,
} from "@/types";
import { CategoryBadge } from "@/components/atoms/CategoryBadge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { RupiahInput } from "@/components/molecules/RupiahInput";
import { useToast } from "@/lib/store/toast";

const CATEGORIES = Object.keys(PROGRAM_CATEGORY_LABEL) as ProgramCategory[];
const TYPES = Object.keys(PROGRAM_TYPE_LABEL) as ProgramType[];

export function AdminProgramOrganism() {
  const { push } = useToast();

  // --- Filter & Pagination State ---
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedSort, setSelectedSort] = useState<"latest" | "oldest" | "target_asc" | "target_desc">("latest");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // --- Data State ---
  const [data, setData] = useState<PaginatedResult<Program> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // --- Modal Form State ---
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [formNama, setFormNama] = useState("");
  const [formType, setFormType] = useState<ProgramType>("wakaf-melalui-uang");
  const [formKategori, setFormKategori] = useState<ProgramCategory>("masjid");
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

  // Reset all filters
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

  // Handle Create Program
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

  async function handleCreateProgram(e: React.FormEvent) {
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

      resetCreateForm();
      setIsCreateOpen(false);
      fetchPrograms();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFormErrors(err.fieldErrors);
      }
      push({
        kind: "error",
        title: "Gagal Membuat Program",
        desc: err instanceof Error ? err.message : "Terjadi kesalahan.",
      });
    } finally {
      setFormSubmitting(false);
    }
  }

  const items = data?.items ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="animate-fade-in space-y-6">
      {/* ===================================================================== */}
      {/* 1. EXECUTIVE HEADER                                                    */}
      {/* ===================================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-500">
            <span>Portal Admin</span>
            <span className="text-brand-300">/</span>
            <span>Manajemen Konten</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
            Kelola Program Wakaf
          </h1>
          <p className="mt-1 text-sm text-brand-600">
            Pantau progres dana, kelola kampanye wakaf & zakat, serta atur publikasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          <button
            type="button"
            onClick={() => fetchPrograms()}
            disabled={loading}
            className="btn-outline px-3.5 py-2.5 text-xs text-brand-700 hover:text-brand-900"
            title="Muat ulang data"
          >
            <svg
              className={`h-3.5 w-3.5 ${loading ? "animate-spin text-brand-500" : ""}`}
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
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary px-4 py-2.5 text-xs font-semibold shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>+ Tambah Program</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. SEARCH & FILTER TOOLBAR                                            */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-brand-200/90 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-3">
          {/* Baris Atas: Input Pencarian Lengkap */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari berdasarkan nama program, deskripsi, atau lokasi..."
              className="input pl-10 pr-9 text-xs sm:text-sm placeholder:text-brand-400"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-400 hover:text-brand-600"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Baris Bawah: Dropdown Filter & Urutan */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
            {/* Filter Jenis */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-brand-500 uppercase tracking-wider">
                Jenis
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="input py-2 px-3 text-xs"
              >
                <option value="">Semua Jenis</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PROGRAM_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kategori */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-brand-500 uppercase tracking-wider">
                Kategori
              </label>
              <select
                value={selectedKategori}
                onChange={(e) => {
                  setSelectedKategori(e.target.value);
                  setPage(1);
                }}
                className="input py-2 px-3 text-xs"
              >
                <option value="">Semua Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {PROGRAM_CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-brand-500 uppercase tracking-wider">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as "all" | "active" | "inactive");
                  setPage(1);
                }}
                className="input py-2 px-3 text-xs"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>

            {/* Filter Sorting */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-brand-500 uppercase tracking-wider">
                Urutan
              </label>
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value as "latest" | "oldest" | "target_asc" | "target_desc");
                  setPage(1);
                }}
                className="input py-2 px-3 text-xs"
              >
                <option value="latest">Terbaru Ditambahkan</option>
                <option value="oldest">Paling Lama</option>
                <option value="target_desc">Target Tertinggi</option>
                <option value="target_asc">Target Terendah</option>
              </select>
            </div>

            {/* Tombol Reset Filter */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn-outline w-full py-2 px-3 text-xs text-brand-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Reset Filter</span>
                </button>
              ) : (
                <div className="hidden lg:flex w-full items-center justify-center py-2 text-[11px] text-brand-400">
                  <span>{total} item</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. TABLE / CARD DISPLAY                                               */}
      {/* ===================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-brand-200/90 bg-white shadow-xs">
        {loading ? (
          <div className="divide-y divide-brand-100 p-4 sm:p-6 space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 pt-3 first:pt-0">
                <div className="skeleton h-14 w-14 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3 rounded-sm" />
                  <div className="skeleton h-3 w-1/4 rounded-sm" />
                </div>
                <div className="skeleton h-8 w-24 rounded-lg shrink-0 hidden sm:block" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="mt-3 text-sm font-semibold text-red-800">{error}</p>
            <button
              onClick={() => fetchPrograms()}
              className="btn-outline mt-3 px-4 py-1.5 text-xs text-brand-800"
            >
              Coba Muat Ulang
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <EmptyState
              title={hasActiveFilters ? "Tidak ada program yang cocok" : "Belum ada program"}
              desc={
                hasActiveFilters
                  ? "Coba ubah kata kunci atau bersihkan filter pencarian."
                  : "Mulai dengan menambahkan program wakaf pertama untuk ditampilkan ke publik."
              }
              action={
                hasActiveFilters ? (
                  <button onClick={handleResetFilters} className="btn-outline text-xs mt-2">
                    Bersihkan Filter
                  </button>
                ) : (
                  <button onClick={() => setIsCreateOpen(true)} className="btn-primary text-xs mt-2">
                    + Tambah Program Baru
                  </button>
                )
              }
            />
          </div>
        ) : (
          <>
            {/* DESKTOP DATA TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm text-brand-950">
                <thead className="border-b border-brand-100 bg-brand-50/60 text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      Program & Lokasi
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Klasifikasi
                    </th>
                    <th scope="col" className="px-4 py-3.5 w-64">
                      Capaian & Target
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-center">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">
                  {items.map((p) => {
                    const pct = persen(p.terkumpul, p.target);
                    const isToggling = togglingId === p.id;
                    return (
                      <tr
                        key={p.id}
                        className="group transition-colors hover:bg-brand-50/30"
                      >
                        {/* 1. Program & Lokasi */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.nama}
                                className="h-12 w-12 rounded-xl object-cover border border-brand-200/80 shadow-xs shrink-0"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100/70 border border-brand-200/50 text-brand-700 font-bold text-xs shrink-0">
                                {p.nama.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <Link
                                href={`/program/${p.slug}`}
                                target="_blank"
                                className="font-semibold text-brand-950 hover:text-brand-700 transition line-clamp-1"
                                title={p.nama}
                              >
                                {p.nama}
                              </Link>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-brand-500">
                                <span className="inline-flex items-center gap-1">
                                  <svg className="h-3 w-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                  </svg>
                                  {p.lokasi}
                                </span>
                                <span>•</span>
                                <span className="truncate max-w-[150px]">{p.nazhir}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Klasifikasi */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20">
                              {PROGRAM_TYPE_LABEL[p.program_type]}
                            </span>
                            <CategoryBadge kategori={p.kategori} />
                          </div>
                        </td>

                        {/* 3. Capaian & Target */}
                        <td className="px-4 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-brand-950">
                                {formatRupiah(p.terkumpul)}
                              </span>
                              <span className="text-[11px] text-brand-500 font-medium">
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-brand-500">
                              <span>Target: {formatRupiah(p.target)}</span>
                              <span>{p.jumlahWakif} wakif</span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Status Switch / Toggle */}
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(p)}
                            disabled={isToggling}
                            title={p.aktif ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                              p.aktif
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100"
                                : "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/20 hover:bg-zinc-200"
                            }`}
                          >
                            {isToggling ? (
                              <Spinner className="h-2.5 w-2.5 text-brand-600" />
                            ) : (
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  p.aktif ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                                }`}
                              />
                            )}
                            <span>{p.aktif ? "Aktif" : "Nonaktif"}</span>
                          </button>
                        </td>

                        {/* 5. Aksi */}
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/program/${p.slug}`}
                            target="_blank"
                            className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-1 text-brand-700 hover:text-brand-900"
                          >
                            <span>Lihat Publik</span>
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS VIEW */}
            <div className="divide-y divide-brand-100 lg:hidden">
              {items.map((p) => {
                const pct = persen(p.terkumpul, p.target);
                const isToggling = togglingId === p.id;
                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="badge bg-brand-50 text-brand-700 text-[10px]">
                            {PROGRAM_TYPE_LABEL[p.program_type]}
                          </span>
                          <CategoryBadge kategori={p.kategori} />
                        </div>
                        <h4 className="mt-1 font-semibold text-brand-950 text-sm leading-snug">
                          {p.nama}
                        </h4>
                        <p className="mt-0.5 text-xs text-brand-500">
                          {p.lokasi} · {p.nazhir}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        disabled={isToggling}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.aktif
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-500/20"
                        }`}
                      >
                        {isToggling ? (
                          <Spinner className="h-2.5 w-2.5" />
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.aktif ? "bg-emerald-500" : "bg-zinc-400"
                            }`}
                          />
                        )}
                        <span>{p.aktif ? "Aktif" : "Nonaktif"}</span>
                      </button>
                    </div>

                    {/* Progress Dana Mobile */}
                    <div className="space-y-1.5 rounded-xl bg-brand-50/50 p-3">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-bold text-brand-950">
                          {formatRupiah(p.terkumpul)}
                        </span>
                        <span className="text-brand-600 font-semibold">{pct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-200/50">
                        <div
                          className="h-full rounded-full bg-brand-600"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-brand-500">
                        <span>Target: {formatRupiah(p.target)}</span>
                        <span>{p.jumlahWakif} wakif</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <Link
                        href={`/program/${p.slug}`}
                        target="_blank"
                        className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-1"
                      >
                        <span>Lihat Publik</span>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===================================================================== */}
            {/* 4. PAGINATION CONTROLS                                                */}
            {/* ===================================================================== */}
            <div className="flex flex-col gap-3 border-t border-brand-100 bg-brand-50/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between text-xs text-brand-600">
              <div className="flex items-center gap-2">
                <span>
                  Menampilkan <strong className="text-brand-950">{startItem}</strong>–
                  <strong className="text-brand-950">{endItem}</strong> dari{" "}
                  <strong className="text-brand-950">{total}</strong> program
                </span>
                <span className="text-brand-300">|</span>
                <div className="flex items-center gap-1.5">
                  <span>Baris:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-brand-200 bg-white py-1 px-2 text-xs text-brand-950 focus:border-brand-500 focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 font-medium text-brand-800 transition hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  ← Sebelumnya
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      return (
                        <div key={p} className="flex items-center">
                          {prev && p - prev > 1 && (
                            <span className="px-1 text-brand-400">...</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setPage(p)}
                            className={`h-7 w-7 rounded-lg text-xs font-semibold transition ${
                              page === p
                                ? "bg-brand-600 text-white shadow-xs"
                                : "text-brand-700 hover:bg-brand-100/70"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 font-medium text-brand-800 transition hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 5. MODAL TAMBAH PROGRAM                                               */}
      {/* ===================================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-brand-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-100 px-6 py-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-950">
                  Tambah Program Baru
                </h3>
                <p className="text-xs text-brand-500">
                  Daftarkan program wakaf, infaq, atau zakat baru ke dalam sistem.
                </p>
              </div>
              <button
                onClick={() => {
                  resetCreateForm();
                  setIsCreateOpen(false);
                }}
                className="rounded-lg p-1.5 text-brand-400 hover:bg-brand-50 hover:text-brand-600"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateProgram} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">Nama Program *</label>
                  <input
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    className={`input ${formErrors.nama ? "input-error" : ""}`}
                    placeholder="mis. Pembangunan Sumur Wakaf Dusun Berkah"
                  />
                  {formErrors.nama && <p className="field-error">{formErrors.nama}</p>}
                </div>

                <div>
                  <label className="label">Jenis Program *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ProgramType)}
                    className="input"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {PROGRAM_TYPE_LABEL[t]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Kategori *</label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value as ProgramCategory)}
                    className={`input ${formErrors.kategori ? "input-error" : ""}`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {PROGRAM_CATEGORY_LABEL[c]}
                      </option>
                    ))}
                  </select>
                  {formErrors.kategori && <p className="field-error">{formErrors.kategori}</p>}
                </div>

                <div>
                  <label className="label">Lokasi *</label>
                  <input
                    value={formLokasi}
                    onChange={(e) => setFormLokasi(e.target.value)}
                    className={`input ${formErrors.lokasi ? "input-error" : ""}`}
                    placeholder="Kota, Provinsi"
                  />
                  {formErrors.lokasi && <p className="field-error">{formErrors.lokasi}</p>}
                </div>

                <div>
                  <label className="label">Target Penghimpunan *</label>
                  <RupiahInput
                    value={formTarget}
                    onChange={setFormTarget}
                    invalid={Boolean(formErrors.target)}
                  />
                  {formErrors.target && <p className="field-error">{formErrors.target}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Ringkasan Singkat *</label>
                  <input
                    value={formRingkasan}
                    onChange={(e) => setFormRingkasan(e.target.value)}
                    className={`input ${formErrors.ringkasan ? "input-error" : ""}`}
                    placeholder="Ringkasan 1-2 kalimat untuk kartu program..."
                  />
                  {formErrors.ringkasan && <p className="field-error">{formErrors.ringkasan}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Deskripsi Lengkap *</label>
                  <textarea
                    rows={4}
                    value={formDeskripsi}
                    onChange={(e) => setFormDeskripsi(e.target.value)}
                    className={`input resize-none ${formErrors.deskripsi ? "input-error" : ""}`}
                    placeholder="Jelaskan urgensi, manfaat, dan rincian program..."
                  />
                  {formErrors.deskripsi && <p className="field-error">{formErrors.deskripsi}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="label">
                    URL Gambar <span className="text-brand-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="input"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="mt-1 text-[11px] text-brand-400">
                    Bila dikosongkan, program akan memakai ilustrasi default sesuai kategori.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Nazhir / Lembaga Pengelola *</label>
                  <input
                    value={formNazhir}
                    onChange={(e) => setFormNazhir(e.target.value)}
                    className={`input ${formErrors.nazhir ? "input-error" : ""}`}
                  />
                  {formErrors.nazhir && <p className="field-error">{formErrors.nazhir}</p>}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-brand-100">
                <button
                  type="button"
                  onClick={() => {
                    resetCreateForm();
                    setIsCreateOpen(false);
                  }}
                  className="btn-outline px-4 py-2 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn-primary px-5 py-2 text-xs"
                >
                  {formSubmitting && <Spinner className="h-3.5 w-3.5" />}
                  <span>Simpan Program</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

