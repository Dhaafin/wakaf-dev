"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useProgramBrowser, type PublicCatalogSort } from "@/hooks/useProgramBrowser";
import { ProgramCard } from "@/components/molecules/ProgramCard";
import { ProgramGridSkeleton } from "@/components/molecules/ProgramCardSkeleton";
import { CategoryExtraModal } from "@/components/molecules/CategoryExtraModal";
import { SelectDropdown } from "@/components/molecules/SelectDropdown";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Spinner } from "@/components/atoms/Spinner";
import { PROGRAM_TYPE_LABEL, type ProgramType } from "@/types";

const customEase = [0.16, 1, 0.3, 1] as const;

const TYPE_TABS: { value: string; label: string }[] = [
  { value: "semua", label: "Semua Program" },
  { value: "wakaf-uang", label: PROGRAM_TYPE_LABEL["wakaf-uang"] },
  { value: "wakaf-melalui-uang", label: PROGRAM_TYPE_LABEL["wakaf-melalui-uang"] },
  { value: "infaq-shadaqah", label: PROGRAM_TYPE_LABEL["infaq-shadaqah"] },
  { value: "zakat", label: PROGRAM_TYPE_LABEL["zakat"] },
];

const PUBLIC_SORT_OPTIONS: { value: PublicCatalogSort; label: string }[] = [
  { value: "popular", label: "Paling Banyak Didukung" },
  { value: "urgent", label: "Paling Mendesak" },
  { value: "near_goal", label: "Hampir Terkumpul" },
  { value: "latest", label: "Terbitan Terbaru" },
];

const QUICK_TAGS = ["Masjid", "Air Bersih", "Pendidikan", "Zakat", "Kemanusiaan"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

export function ProgramBrowserOrganism() {
  const {
    searchInput,
    setSearchInput,
    selectedType,
    selectedKategori,
    selectedSort,
    programs,
    categories,
    types,
    total,
    hasMore,
    loading,
    loadingMore,
    error,
    hasActiveFilters,
    handleTypeChange,
    handleKategoriChange,
    handleSortChange,
    handleApplyTagSuggestion,
    handleLoadMore,
    handleResetFilters,
  } = useProgramBrowser();

  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);

  const MAX_VISIBLE_PILLS = 5;
  const visibleCategories = categories.slice(0, MAX_VISIBLE_PILLS);
  const extraCategories = categories.slice(MAX_VISIBLE_PILLS);
  const selectedExtraCategory = extraCategories.find((c) => c.key === selectedKategori);

  return (
    <div className="bg-white text-brand-950 min-h-screen">
      {/* 1. HERO SEARCH BANNER (Header Zamrud Hijau KBM) */}
      <section className="relative overflow-hidden bg-brand-900 text-white py-14 sm:py-20 border-b border-brand-800">

        <motion.div
          className="container-app relative z-10 flex flex-col items-center text-center px-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Emblem Rub el Hizb Islami Berputar Halus */}
          <motion.div variants={itemVariants} className="mb-5 text-brand-400/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
                <rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)"/>
              </svg>
            </motion.div>
          </motion.div>

          {/* Label Editorial Garis Ganda */}
          <motion.div variants={itemVariants} className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-brand-400/30" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/80">
              Katalog Program KBM
            </span>
            <div className="h-px w-8 bg-brand-400/30" />
          </motion.div>

          {/* Masterpiece Serif Typography */}
          <motion.h1
            variants={itemVariants}
            className="font-serif font-medium leading-[1.1] tracking-tight text-white text-3xl sm:text-5xl max-w-3xl"
          >
            Program Kebaikan &amp;{" "}
            <span className="italic text-emerald-400">Wakaf Abadi.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-3.5 max-w-[600px] text-xs sm:text-base leading-relaxed text-brand-100/80"
          >
            Temukan dan tunaikan donasi serta wakaf untuk berbagai program keagamaan, pendidikan, dan sosial yang berdampak nyata bagi sesama.
          </motion.p>

          {/* Masterpiece Hero Search Box Glassmorphism */}
          <motion.div variants={itemVariants} className="mt-8 w-full max-w-2xl">
            <div className="group relative flex items-center rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur-md ring-1 ring-black/5 hover:bg-white transition-all duration-300">
              <span className="pointer-events-none pl-3 text-brand-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari program kebaikan (misal: 'Masjid', 'Bogor', 'Air Bersih')..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-brand-950 placeholder:text-brand-400 focus:outline-none"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="px-2 text-brand-400 hover:text-brand-700 transition cursor-pointer"
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}

              {/* Inline Impact Sort Dropdown */}
              <div className="border-l border-brand-200 pl-2 pr-1 shrink-0 w-[200px]">
                <SelectDropdown
                  value={selectedSort}
                  onChange={(val) => handleSortChange(val as PublicCatalogSort)}
                  options={PUBLIC_SORT_OPTIONS}
                  size="sm"
                  className="rounded-xl bg-brand-50/90 font-bold border-brand-200/80 text-brand-900 border"
                  clearable={false}
                />
              </div>
            </div>

            {/* Quick Tag Suggestions */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-emerald-100/80">
              <span className="font-semibold text-emerald-200/90">Populer:</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleApplyTagSuggestion(tag)}
                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-100 hover:bg-white/20 transition cursor-pointer border border-white/10"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. STICKY LIGHT FILTER SUB-BAR (Katalog Putih Bersih) */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-brand-100/90 py-2.5 shadow-2xs">
        <div className="container-app space-y-2">
          {/* Row 1: Underline Program Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-brand-100/70 pb-1.5">
            {(types.length > 0 ? types : TYPE_TABS.map(t => ({ key: t.value, label: t.label, count: 0 }))).map((t) => {
              const isActive = selectedType === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleTypeChange(t.key)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 border-b-2 cursor-pointer ${
                    isActive
                      ? "border-brand-600 text-brand-950 font-bold"
                      : "border-transparent text-brand-600 hover:text-brand-950 hover:border-brand-300"
                  }`}
                >
                  {t.label} {t.count > 0 && <span className="text-[10px] ml-1 opacity-70">({t.count})</span>}
                </button>
              );
            })}
          </div>

          {/* Row 2: Dynamic API Category Pills (Maksimal 5 Pil Tampil + Extra Modal) */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500 shrink-0 mr-1">
                Kategori:
              </span>
              {visibleCategories.map((c) => {
                const isActive = selectedKategori === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => handleKategoriChange(c.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-brand-700 text-white font-bold shadow-xs border border-brand-800"
                        : "bg-brand-50/80 border border-brand-200/80 text-brand-700 hover:bg-brand-100 hover:text-brand-950"
                    }`}
                  >
                    <span>{c.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        isActive ? "bg-white/20 text-white" : "bg-brand-100 text-brand-800"
                      }`}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}

              {/* Tombol Extra Filter jika kategori > 5 */}
              {extraCategories.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsExtraModalOpen(true)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0 transition-all duration-200 cursor-pointer border ${
                    selectedExtraCategory
                      ? "bg-brand-700 text-white font-bold border-brand-800 shadow-xs"
                      : "bg-brand-100/90 border-brand-200 text-brand-800 hover:bg-brand-200/80 hover:text-brand-950"
                  }`}
                >
                  <span>
                    {selectedExtraCategory ? selectedExtraCategory.label : `+${extraCategories.length} Lainnya`}
                  </span>
                  {selectedExtraCategory && (
                    <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                      {selectedExtraCategory.count}
                    </span>
                  )}
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. MAIN CATALOG GRID SECTION (Warna Putih Bersih) */}
      <section className="py-10 bg-white min-h-[60vh]">
        <div className="container-app">
          {loading ? (
            <ProgramGridSkeleton />
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              <p className="font-semibold">{error}</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
              >
                Coba Muat Ulang
              </button>
            </div>
          ) : programs.length === 0 ? (
            <EmptyState
              title="Tidak ada program yang sesuai"
              desc="Coba ubah kata kunci pencarian, sesuaikan filter kategori, atau reset filter."
              action={
                hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition cursor-pointer"
                  >
                    Reset Semua Filter
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-8">
              {/* Informational Count & Filter Reset Bar */}
              <div className="flex items-center justify-between text-xs text-brand-600">
                <p>
                  Menampilkan <strong className="font-bold text-brand-950">{programs.length}</strong> dari <strong className="font-bold text-brand-950">{total}</strong> program kebaikan terverifikasi
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="rounded-full bg-brand-100/80 px-3.5 py-1 font-semibold text-brand-800 hover:bg-brand-200 transition cursor-pointer"
                  >
                    Reset Filter ↺
                  </button>
                )}
              </div>

              {/* Grid Cards */}
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {programs.map((p) => (
                  <motion.div key={p.id} variants={itemVariants}>
                    <ProgramCard program={p} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Public Load More Button */}
              {hasMore && (
                <div className="pt-8 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-brand-300 bg-white px-8 py-3.5 text-xs sm:text-sm font-bold text-brand-950 shadow-xs hover:bg-brand-50 hover:border-brand-400 transition-all duration-200 cursor-pointer disabled:opacity-60"
                  >
                    {loadingMore ? (
                      <>
                        <Spinner className="h-4 w-4 text-brand-600" />
                        <span>Memuat Program Berikutnya...</span>
                      </>
                    ) : (
                      <>
                        <span>Tampilkan Lebih Banyak Program</span>
                        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-bold text-brand-800">
                          +{total - programs.length} lagi
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CategoryExtraModal
        isOpen={isExtraModalOpen}
        onClose={() => setIsExtraModalOpen(false)}
        categories={categories}
        selectedKategori={selectedKategori}
        onSelectKategori={handleKategoriChange}
      />
    </div>
  );
}
