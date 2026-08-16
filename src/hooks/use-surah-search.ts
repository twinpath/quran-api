"use client";

import { useState, useMemo } from "react";
import type { ApiSurahListItem, SurahSortKey, AyahCountRangeKey } from "@/types/api";

type RevelationFilter = "All" | string;

/**
 * Hook for searching and filtering the surah catalog.
 */
export function useSurahSearch(initialSurahs: ApiSurahListItem[]) {
  const [query, setQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>("All");
  const [sortKey, setSortKey] = useState<SurahSortKey>("number-asc");
  const [ayahRange, setAyahRange] = useState<AyahCountRangeKey>("all");

  const filteredSurahs = useMemo<ApiSurahListItem[]>(() => {
    let results = [...initialSurahs];

    // 1. Filter by Revelation Type
    if (revelationFilter !== "All") {
      results = results.filter((s) => s.revelationType === revelationFilter);
    }

    // 2. Filter by Ayah Count Range
    if (ayahRange === "short") {
      results = results.filter((s) => s.numberOfAyah < 50);
    } else if (ayahRange === "medium") {
      results = results.filter((s) => s.numberOfAyah >= 50 && s.numberOfAyah <= 100);
    } else if (ayahRange === "long") {
      results = results.filter((s) => s.numberOfAyah > 100);
    }

    // 3. Filter by Search Query
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(
        (s) =>
          s.nameLatin.toLowerCase().includes(q) ||
          s.translationName.toLowerCase().includes(q) ||
          s.name.includes(q) ||
          String(s.number) === q,
      );
    }

    // 4. Sort Results
    results.sort((a, b) => {
      switch (sortKey) {
        case "number-asc":
          return a.number - b.number;
        case "number-desc":
          return b.number - a.number;
        case "ayahs-asc":
          return a.numberOfAyah - b.numberOfAyah;
        case "ayahs-desc":
          return b.numberOfAyah - a.numberOfAyah;
        case "name-asc":
          return a.nameLatin.localeCompare(b.nameLatin);
        case "name-desc":
          return b.nameLatin.localeCompare(a.nameLatin);
        default:
          return 0;
      }
    });

    return results;
  }, [initialSurahs, query, revelationFilter, sortKey, ayahRange]);

  const isFiltered = useMemo(() => {
    return query !== "" || revelationFilter !== "All" || sortKey !== "number-asc" || ayahRange !== "all";
  }, [query, revelationFilter, sortKey, ayahRange]);

  const resetFilters = () => {
    setQuery("");
    setRevelationFilter("All");
    setSortKey("number-asc");
    setAyahRange("all");
  };

  return {
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
    totalCount: initialSurahs.length,
  };
}

export type { RevelationFilter };

