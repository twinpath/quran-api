"use client";

import { useState, useMemo } from "react";
import type { ApiSurahListItem } from "@/types/api";

type RevelationFilter = "All" | string;

/**
 * Hook for searching and filtering the surah catalog.
 */
export function useSurahSearch(initialSurahs: ApiSurahListItem[]) {
  const [query, setQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>("All");

  const filteredSurahs = useMemo<ApiSurahListItem[]>(() => {
    let results = initialSurahs;

    if (revelationFilter !== "All") {
      results = results.filter((s) => s.revelationType === revelationFilter);
    }

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

    return results;
  }, [initialSurahs, query, revelationFilter]);

  return {
    query,
    setQuery,
    revelationFilter,
    setRevelationFilter,
    filteredSurahs,
    totalCount: initialSurahs.length,
  };
}

export type { RevelationFilter };
