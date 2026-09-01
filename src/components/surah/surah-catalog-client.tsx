"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSurahCatalog } from "@/hooks/use-surah-catalog";
import { SurahCatalogFilters } from "./surah-catalog-filters";
import { SurahGrid } from "./surah-grid";
import type { SurahCatalogClientProps } from "@/types";

export function SurahCatalogClient({ initialSurahs, isLoading: initialLoading }: SurahCatalogClientProps) {
  const {
    surahs,
    filteredSurahs,
    totalCount,
    isLoading,
    query,
    setQuery,
    revelationFilter,
    setRevelationFilter,
    sortKey,
    setSortKey,
    ayahRange,
    setAyahRange,
    isFiltered,
    resetFilters,
    comboboxValue,
    handleSurahSelect,
    retryFetch,
  } = useSurahCatalog(initialSurahs, initialLoading);

  return (
    <section id="surah-catalog" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <div className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {isLoading ? <Skeleton className="mx-auto mb-2 h-9 w-64" /> : <h1>Surah Catalog</h1>}
        </div>
        <div className="mt-2 text-muted-foreground">
          {isLoading ? (
            <Skeleton className="mx-auto h-4 w-full max-w-lg" />
          ) : (
            `Browse all ${totalCount} surahs of the Holy Quran with Arabic script, Latin transliterations, official Kemenag RI translations, and metadata.`
          )}
        </div>
      </div>

      <SurahCatalogFilters
        isLoading={isLoading}
        surahs={surahs}
        query={query}
        onQueryChange={setQuery}
        revelationFilter={revelationFilter}
        onRevelationFilterChange={setRevelationFilter}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        ayahRange={ayahRange}
        onAyahRangeChange={setAyahRange}
        isFiltered={isFiltered}
        onResetFilters={resetFilters}
        comboboxValue={comboboxValue}
        onSurahSelect={handleSurahSelect}
      />

      <div className="mb-4 text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          `Showing ${filteredSurahs.length} of ${totalCount} surahs`
        )}
      </div>

      <SurahGrid
        isLoading={isLoading}
        filteredSurahs={filteredSurahs}
        totalCount={totalCount}
        isFiltered={isFiltered}
        onResetFilters={resetFilters}
        onRetryFetch={retryFetch}
      />
    </section>
  );
}




