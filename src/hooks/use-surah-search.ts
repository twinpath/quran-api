"use client";

import { useState, useMemo } from "react";
import type { SurahSummary, RevelationType } from "@/types/quran";
import { SURAH_CATALOG } from "@/lib/quran-data";

type RevelationFilter = "All" | RevelationType;

/**
 * Hook for searching and filtering the surah catalog.
 */
export function useSurahSearch() {
  const [query, setQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>("All");

  const filteredSurahs = useMemo<SurahSummary[]>(() => {
    let results = SURAH_CATALOG;

    if (revelationFilter !== "All") {
      results = results.filter((s) => s.revelationType === revelationFilter);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(
        (s) =>
          s.nameLatin.toLowerCase().includes(q) ||
          s.translationIdName.toLowerCase().includes(q) ||
          s.name.includes(q) ||
          String(s.number) === q,
      );
    }

    return results;
  }, [query, revelationFilter]);

  return {
    query,
    setQuery,
    revelationFilter,
    setRevelationFilter,
    filteredSurahs,
    totalCount: SURAH_CATALOG.length,
  };
}

export type { RevelationFilter };
