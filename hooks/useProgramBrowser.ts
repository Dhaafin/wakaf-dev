"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Program, ProgramCategory, CategoryMeta } from "@/types";

export type PublicCatalogSort =
  | "popular"
  | "urgent"
  | "near_goal"
  | "latest"
  | "oldest"
  | "target_asc"
  | "target_desc";

export function useProgramBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialKategori = searchParams.get("kategori") as ProgramCategory | null;
  const initialType = searchParams.get("type");
  const initialQ = searchParams.get("q") ?? "";
  const initialSort = (searchParams.get("sort") as PublicCatalogSort) ?? "popular";

  const [searchInput, setSearchInput] = useState(initialQ);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQ);
  const [selectedType, setSelectedType] = useState<string>(initialType ?? "semua");
  const [selectedKategori, setSelectedKategori] = useState<string>(initialKategori ?? "semua");
  const [selectedSort, setSelectedSort] = useState<PublicCatalogSort>(initialSort);

  const [page, setPage] = useState<number>(1);
  const limit = 9;

  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  const [types, setTypes] = useState<CategoryMeta[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync filter states to URL search parameters
  const updateUrlParams = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, val]) => {
        if (!val || val === "semua" || (key === "sort" && val === "popular")) {
          newParams.delete(key);
        } else {
          newParams.set(key, val);
        }
      });
      const qs = newParams.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const fetchPrograms = useCallback(
    async (isLoadMore = false, targetPage = 1) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await api.listPrograms({
          page: targetPage,
          limit,
          q: debouncedSearch || undefined,
          type: selectedType !== "semua" ? selectedType : undefined,
          kategori: selectedKategori !== "semua" ? selectedKategori : undefined,
          sort: selectedSort,
          status: "active",
        });

        const fetchedItems = res.items || [];
        if (isLoadMore) {
          setPrograms((prev) => [...prev, ...fetchedItems]);
        } else {
          setPrograms(fetchedItems);
        }

        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
        
        if (res.types && res.types.length > 0) {
          setTypes(res.types);
        }

        const currentTotal = res.pagination?.total ?? 0;
        const currentTotalPages = res.pagination?.totalPages ?? 1;
        setTotal(currentTotal);
        setHasMore(targetPage < currentTotalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat daftar program.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [limit, debouncedSearch, selectedType, selectedKategori, selectedSort],
  );

  useEffect(() => {
    setPage(1);
    fetchPrograms(false, 1);
    updateUrlParams({
      q: debouncedSearch || undefined,
      type: selectedType,
      kategori: selectedKategori,
      sort: selectedSort !== "popular" ? selectedSort : undefined,
    });
  }, [fetchPrograms, updateUrlParams, debouncedSearch, selectedType, selectedKategori, selectedSort]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPrograms(true, nextPage);
  };

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
  };

  const handleKategoriChange = (val: string) => {
    setSelectedKategori(val);
  };

  const handleSortChange = (val: PublicCatalogSort) => {
    setSelectedSort(val);
  };

  const handleApplyTagSuggestion = (tag: string) => {
    setSearchInput(tag);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedType("semua");
    setSelectedKategori("semua");
    setSelectedSort("popular");
  };

  const hasActiveFilters = Boolean(
    debouncedSearch ||
      selectedType !== "semua" ||
      selectedKategori !== "semua" ||
      selectedSort !== "popular",
  );

  return {
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
  };
}

export type UseProgramBrowserReturn = ReturnType<typeof useProgramBrowser>;
