"use client";

import { useState, useEffect, useCallback } from "react";
import { useSurahSearch } from "@/hooks/use-surah-search";
import type { ApiSurahListItem, AyahCountRangeKey, SurahSortKey } from "@/types/api";

/**
 * Hook that manages the full surah catalog lifecycle:
 * - Client-side auto-fetch fallback when SSG delivers empty data
 * - Prop sync when server-rendered data arrives late
 * - Delegates filtering/sorting to useSurahSearch
 * - Jump-to-surah scroll handler
 * - Retry fetch on failure
 */
export function useSurahCatalog(initialSurahs: ApiSurahListItem[], initialLoading?: boolean) {
  const [surahs, setSurahs] = useState<ApiSurahListItem[]>(initialSurahs);
  const [prevInitialSurahs, setPrevInitialSurahs] = useState<ApiSurahListItem[]>(initialSurahs);
  const [fetching, setFetching] = useState<boolean>(false);

  // Sync state during render if props update with non-empty initialSurahs
  if (initialSurahs !== prevInitialSurahs) {
    setPrevInitialSurahs(initialSurahs);
    if (initialSurahs.length > 0) {
      setSurahs(initialSurahs);
    }
  }

  // Client-side auto-fetch fallback when surahs array is empty on mount
  useEffect(() => {
    if (initialSurahs.length === 0 && !initialLoading) {
      let isMounted = true;
      fetch("/api/surah")
        .then((res) => res.json())
        .then((data: unknown) => {
          const resData = data as { success?: boolean; data?: ApiSurahListItem[] };
          if (isMounted && resData.success && Array.isArray(resData.data)) {
            setSurahs(resData.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch surah list client-side:", err);
        })
        .finally(() => {
          if (isMounted) setFetching(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [initialSurahs.length, initialLoading]);

  const isLoading = initialLoading || (surahs.length === 0 && !initialLoading) || fetching;

  const {
    query,
    setQuery,
    revelationFilter,
    setRevelationFilter,
    sortKey,
    setSortKey,
    ayahRange,
    setAyahRange,
    filteredSurahs,
    isFiltered,
    resetFilters,
    totalCount,
  } = useSurahSearch(surahs);

  const [comboboxValue, setComboboxValue] = useState("");

  const handleSurahSelect = useCallback(
    (numberVal: string) => {
      if (!numberVal) return;
      resetFilters();
      setComboboxValue("");
      // Allow state reset to process before trying to select element
      setTimeout(() => {
        const element = document.getElementById(`surah-${numberVal}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-2", "ring-primary", "scale-[1.02]", "transition-all", "duration-300");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-primary", "scale-[1.02]", "transition-all", "duration-300");
          }, 2000);
        }
      }, 100);
    },
    [resetFilters],
  );

  const retryFetch = useCallback(() => {
    setFetching(true);
    fetch("/api/surah")
      .then((res) => res.json())
      .then((data: unknown) => {
        const resData = data as { success?: boolean; data?: ApiSurahListItem[] };
        if (resData.success && Array.isArray(resData.data)) setSurahs(resData.data);
      })
      .catch((err) => console.error("Retry fetch failed:", err))
      .finally(() => setFetching(false));
  }, []);

  return {
    // Data
    surahs,
    filteredSurahs,
    totalCount,
    isLoading,

    // Search & filter
    query,
    setQuery,
    revelationFilter,
    setRevelationFilter,
    sortKey,
    setSortKey: setSortKey as (v: SurahSortKey) => void,
    ayahRange,
    setAyahRange: setAyahRange as (v: AyahCountRangeKey) => void,
    isFiltered,
    resetFilters,

    // Jump combobox
    comboboxValue,
    handleSurahSelect,

    // Retry
    retryFetch,
  };
}
