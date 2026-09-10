"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

// Artwork & icon helper per kategori untuk visual fallback yang indah
function getCategoryVisual(kategori: ProgramCategory) {
  switch (kategori) {
    case "masjid":
      return {
        bg: "from-emerald-600 to-teal-700",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-5.25a3.75 3.75 0 00-7.5 0V21M12 3a9 9 0 00-9 9v9h18v-9a9 9 0 00-9-9z" />
          </svg>
        ),
      };
    case "pendidikan":
      return {
        bg: "from-amber-500 to-orange-600",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
          </svg>
        ),
      };
    case "produktif-umkm":
      return {
        bg: "from-violet-600 to-indigo-700",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        ),
      };
    case "sumur-air-bersih":
      return {
        bg: "from-sky-500 to-blue-600",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ),
      };
    case "kemanusiaan":
      return {
        bg: "from-rose-500 to-red-600",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        ),
      };
    case "sosial-dhuafa":
    default:
      return {
        bg: "from-teal-600 to-emerald-800",
        icon: (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        ),
      };
  }
}

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

  return (
    <div className="animate-fade-in space-y-6">
      {/* ===================================================================== */}
      {/* 1. EXECUTIVE HEADER DENGAN AKSEN VISUAL                                */}
      {/* ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 p-6 sm:p-8 text-white shadow-md">
        {/* Dekorasi Aksen Geometris Islami Halus */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="pointer-events-none absolute right-24 -bottom-16 h-48 w-48 rounded-full bg-accent-500/10 blur-xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200 backdrop-blur-xs ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              <span>Portal Admin Yayasan KBM</span>
            </div>
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
              onClick={() => fetchPrograms()}
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
              <span>+ Tambah Program</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. EXECUTIVE KPI SUMMARY STRIP (4 METRIC MINI-CARDS)                   */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Card 1: Total Program */}
        <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
              Total Program
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-600/10">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">{total}</span>
            <span className="text-xs text-brand-500 font-medium">program</span>
          </div>
          <p className="mt-1 text-[11px] text-brand-400">4 instrumen wakaf & zakat</p>
        </div>

        {/* Card 2: Program Aktif */}
        <div className="card p-4 sm:p-5 transition hover:border-emerald-300 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Sedang Aktif
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-emerald-950 sm:text-3xl">
              {statsSummary.activeCount}
            </span>
            <span className="text-xs text-emerald-700 font-medium">program</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600/80">Tampil di portal publik</p>
        </div>

        {/* Card 3: Total Dana Dihimpun */}
        <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
              Dana Terkumpul
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-50 text-accent-800 ring-1 ring-accent-600/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-serif text-lg font-bold text-brand-950 sm:text-xl truncate block">
              {formatRupiah(statsSummary.totalTerkumpul)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-brand-400">
            Rata-rata {statsSummary.avgPct}% dari target
          </p>
        </div>

        {/* Card 4: Total Donatur */}
        <div className="card p-4 sm:p-5 transition hover:border-brand-300 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
              Donatur / Wakif
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-600/20">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-brand-950 sm:text-3xl">
              {statsSummary.totalWakif.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-brand-500 font-medium">wakif</span>
          </div>
          <p className="mt-1 text-[11px] text-brand-400">Partisipasi masyarakat</p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. SEARCH & REFINED FILTER CONSOLE                                    */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-brand-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Baris 1: Pencarian & Segment Tab Status */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Input Search Modern */}
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
              placeholder="Cari nama program, deskripsi, kota/lokasi..."
              className="input pl-10 pr-9 text-xs sm:text-sm placeholder:text-brand-400"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-400 hover:text-brand-700"
                title="Hapus kata kunci"
              >
                ✕
              </button>
            )}
          </div>

          {/* Segmented Status Buttons (Pill Tab) */}
          <div className="inline-flex rounded-xl bg-sand-100 p-1 border border-brand-200/60 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("all");
                setPage(1);
              }}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                selectedStatus === "all"
                  ? "bg-white text-brand-950 shadow-xs ring-1 ring-brand-200/50"
                  : "text-brand-600 hover:text-brand-950"
              }`}
            >
              Semua
              <span className="ml-1.5 rounded-full bg-brand-100/70 px-1.5 py-0.5 text-[10px] text-brand-700">
                {total}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("active");
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                selectedStatus === "active"
                  ? "bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-200/50"
                  : "text-brand-600 hover:text-brand-950"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Aktif</span>
              <span className="ml-1 rounded-full bg-emerald-100/70 px-1.5 py-0.5 text-[10px] text-emerald-800">
                {statsSummary.activeCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("inactive");
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                selectedStatus === "inactive"
                  ? "bg-white text-zinc-900 shadow-xs ring-1 ring-zinc-200/50"
                  : "text-brand-600 hover:text-brand-950"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              <span>Nonaktif</span>
              <span className="ml-1 rounded-full bg-zinc-200/70 px-1.5 py-0.5 text-[10px] text-zinc-700">
                {Math.max(0, total - statsSummary.activeCount)}
              </span>
            </button>
          </div>
        </div>

        {/* Baris 2: Dropdown Filter Sekunder (Jenis, Kategori, Urutan) */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 pt-1">
          {/* Dropdown Jenis */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
              Jenis Instrumen
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="input py-2 px-3 text-xs"
            >
              <option value="">Semua Jenis Program</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {PROGRAM_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Kategori */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
              Kategori Peruntukan
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

          {/* Dropdown Sorting */}
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-brand-500 uppercase tracking-wider">
              Urutkan Data
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
              <option value="target_desc">Target Dana Tertinggi</option>
              <option value="target_asc">Target Dana Terendah</option>
            </select>
          </div>

          {/* Quick Action: Reset Filter */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex items-end">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-outline w-full py-2 px-3 text-xs text-brand-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Reset Semua Filter</span>
              </button>
            ) : (
              <div className="hidden lg:flex w-full items-center justify-center py-2 text-[11px] text-brand-400">
                <span>Filter standar aktif</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. DATA TABLE (HIGH-CRAFT DESKTOP & MOBILE CARD VIEW)                */}
      {/* ===================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-brand-200/90 bg-white shadow-xs">
        {loading ? (
          <div className="divide-y divide-brand-100 p-4 sm:p-6 space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 pt-3 first:pt-0">
                <div className="skeleton h-14 w-14 rounded-2xl shrink-0" />
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
          <div className="p-12 text-center">
            <EmptyState
              title={hasActiveFilters ? "Tidak ada program yang cocok" : "Belum ada program terdaftar"}
              desc={
                hasActiveFilters
                  ? "Coba ubah kata kunci pencarian atau bersihkan filter yang aktif."
                  : "Mulai daftarkan program wakaf atau zakat baru agar tampil di listing publik."
              }
              action={
                hasActiveFilters ? (
                  <button onClick={handleResetFilters} className="btn-outline text-xs mt-3">
                    Bersihkan Filter
                  </button>
                ) : (
                  <button onClick={() => setIsCreateOpen(true)} className="btn-primary text-xs mt-3">
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
                <thead className="border-b border-brand-100 bg-brand-50/50 text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      Program & Lembaga
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Klasifikasi
                    </th>
                    <th scope="col" className="px-4 py-3.5 w-64">
                      Realisasi & Target
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-center">
                      Status Tayang
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Aksi Cepat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">
                  {items.map((p) => {
                    const pct = persen(p.terkumpul, p.target);
                    const isToggling = togglingId === p.id;
                    const visual = getCategoryVisual(p.kategori);

                    return (
                      <tr
                        key={p.id}
                        className="group transition-colors hover:bg-brand-50/40"
                      >
                        {/* 1. Program, Thumbnail & Lokasi */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.nama}
                                className="h-12 w-12 rounded-2xl object-cover border border-brand-200/80 shadow-xs shrink-0"
                              />
                            ) : (
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${visual.bg} shadow-xs shrink-0`}
                              >
                                {visual.icon}
                              </div>
                            )}

                            <div className="min-w-0">
                              <Link
                                href={`/program/${p.slug}`}
                                target="_blank"
                                className="font-semibold text-brand-950 hover:text-brand-600 transition line-clamp-1 text-sm group-hover:underline"
                                title={p.nama}
                              >
                                {p.nama}
                              </Link>

                              <div className="mt-1 flex items-center gap-2 text-xs text-brand-500">
                                <span className="inline-flex items-center gap-1">
                                  <svg className="h-3.5 w-3.5 text-brand-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                  </svg>
                                  <span className="truncate max-w-[130px]">{p.lokasi}</span>
                                </span>
                                <span>•</span>
                                <span className="truncate max-w-[150px] text-brand-400">{p.nazhir}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Klasifikasi */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20">
                              {PROGRAM_TYPE_LABEL[p.program_type]}
                            </span>
                            <CategoryBadge kategori={p.kategori} />
                          </div>
                        </td>

                        {/* 3. Capaian & Target */}
                        <td className="px-4 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-brand-950 font-sans">
                                {formatRupiah(p.terkumpul)}
                              </span>
                              <span className={`text-[11px] font-bold ${pct >= 100 ? "text-emerald-600" : "text-brand-600"}`}>
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  pct >= 100
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                    : "bg-gradient-to-r from-brand-500 to-brand-600"
                                }`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-brand-500">
                              <span>Target: {formatRupiah(p.target)}</span>
                              <span className="inline-flex items-center gap-1">
                                <svg className="h-3 w-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                {p.jumlahWakif} wakif
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Status Switch / Toggle Interaktif */}
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(p)}
                            disabled={isToggling}
                            title={p.aktif ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                            className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                              p.aktif
                                ? "border border-emerald-200/80 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300"
                                : "border border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            {isToggling ? (
                              <Spinner className="h-2.5 w-2.5 text-brand-600" />
                            ) : (
                              <span className="relative flex h-2 w-2">
                                {p.aktif && (
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                )}
                                <span
                                  className={`relative inline-flex h-2 w-2 rounded-full ${
                                    p.aktif ? "bg-emerald-500" : "bg-zinc-400"
                                  }`}
                                />
                              </span>
                            )}
                            <span>{p.aktif ? "Aktif" : "Nonaktif"}</span>
                          </button>
                        </td>

                        {/* 5. Aksi Cepat */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(p.slug)}
                              className="rounded-lg border border-brand-200 bg-white p-2 text-brand-600 hover:bg-brand-50 hover:text-brand-900 transition"
                              title="Salin tautan publik"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                              </svg>
                            </button>

                            <Link
                              href={`/program/${p.slug}`}
                              target="_blank"
                              className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-1 text-brand-700 hover:text-brand-900 font-semibold"
                            >
                              <span>Lihat</span>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </Link>
                          </div>
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
                const visual = getCategoryVisual(p.kategori);

                return (
                  <div key={p.id} className="p-4 space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.nama}
                            className="h-11 w-11 rounded-xl object-cover border border-brand-200/80 shadow-xs shrink-0"
                          />
                        ) : (
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${visual.bg} shadow-xs shrink-0`}>
                            {visual.icon}
                          </div>
                        )}
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
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        disabled={isToggling}
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.aktif
                            ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20"
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

                    {/* Progress Card Mobile */}
                    <div className="space-y-1.5 rounded-2xl bg-brand-50/50 p-3.5 border border-brand-100">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-bold text-brand-950 font-sans">
                          {formatRupiah(p.terkumpul)}
                        </span>
                        <span className="text-brand-700 font-bold">{pct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-200/50">
                        <div
                          className="h-full rounded-full bg-brand-600"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-brand-500">
                        <span>Target: {formatRupiah(p.target)}</span>
                        <span>{p.jumlahWakif} donatur</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-brand-400 truncate max-w-[180px]">
                        📍 {p.lokasi}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(p.slug)}
                          className="btn-outline py-1.5 px-2.5 text-xs text-brand-600"
                          title="Salin link"
                        >
                          Salin Link
                        </button>
                        <Link
                          href={`/program/${p.slug}`}
                          target="_blank"
                          className="btn-outline py-1.5 px-3 text-xs inline-flex items-center gap-1 font-semibold text-brand-800"
                        >
                          <span>Lihat ↗</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===================================================================== */}
            {/* 5. ELEVATED PAGINATION FOOTER                                         */}
            {/* ===================================================================== */}
            <div className="flex flex-col gap-3 border-t border-brand-100 bg-brand-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between text-xs text-brand-600">
              <div className="flex items-center gap-2">
                <span>
                  Menampilkan <strong className="text-brand-950">{startItem}</strong>–
                  <strong className="text-brand-950">{endItem}</strong> dari{" "}
                  <strong className="text-brand-950">{total}</strong> total program
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
                    className="rounded-lg border border-brand-200 bg-white py-1 px-2 text-xs font-semibold text-brand-950 focus:border-brand-500 focus:outline-none"
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
                  className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-semibold text-brand-800 transition hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white"
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
                            className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
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
                  className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-semibold text-brand-800 transition hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white"
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 6. MODAL TAMBAH PROGRAM                                               */}
      {/* ===================================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-brand-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-100 px-6 py-4 bg-brand-50/40">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-950">
                  Tambah Program Baru
                </h3>
                <p className="text-xs text-brand-500">
                  Daftarkan instrumen wakaf, infaq, atau zakat baru ke dalam sistem Yayasan KBM.
                </p>
              </div>
              <button
                onClick={() => {
                  resetCreateForm();
                  setIsCreateOpen(false);
                }}
                className="rounded-xl p-2 text-brand-400 hover:bg-brand-100 hover:text-brand-700 transition"
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
                  <label className="label">Lokasi Wilayah *</label>
                  <input
                    value={formLokasi}
                    onChange={(e) => setFormLokasi(e.target.value)}
                    className={`input ${formErrors.lokasi ? "input-error" : ""}`}
                    placeholder="Kota / Kabupaten, Provinsi"
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
                    placeholder="Jelaskan urgensi, manfaat, dan rincian penyaluran dana..."
                  />
                  {formErrors.deskripsi && <p className="field-error">{formErrors.deskripsi}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="label">
                    URL Gambar Sampul <span className="text-brand-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="input"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="mt-1 text-[11px] text-brand-400">
                    Bila dikosongkan, program otomatis memakai ilustrasi bawaan sesuai kategori.
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
                  className="btn-primary px-5 py-2 text-xs font-semibold shadow-sm"
                >
                  {formSubmitting && <Spinner className="h-3.5 w-3.5" />}
                  <span>Simpan & Terbitkan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

