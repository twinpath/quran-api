"use client";

import { Search, Filter, X, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { REVELATION_FILTERS, SURAH_SORT_OPTIONS, AYAH_COUNT_FILTERS } from "@/constants";
import type { SurahCatalogFiltersProps } from "@/types";
import type { AyahCountRangeKey, SurahSortKey } from "@/types/api";

export function SurahCatalogFilters({
  isLoading,
  surahs,
  query,
  onQueryChange,
  revelationFilter,
  onRevelationFilterChange,
  sortKey,
  onSortKeyChange,
  ayahRange,
  onAyahRangeChange,
  isFiltered,
  onResetFilters,
  comboboxValue,
  onSurahSelect,
}: SurahCatalogFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Row 1: Search Bar & Combobox Quick Jump */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              className="pl-9 h-10 w-full"
              placeholder="Search by name, translation, or number..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-10 w-full sm:w-[220px]" />
          ) : (
            <Combobox
              items={surahs.map((surah) => String(surah.number))}
              value={comboboxValue}
              onValueChange={(val) => {
                if (val) {
                  onSurahSelect(val);
                }
              }}
            >
              <ComboboxInput
                placeholder="Jump to Surah..."
                className="w-full sm:w-[220px]"
                showClear
              />
              <ComboboxContent className="w-[260px] z-50">
                <ComboboxList>
                  {surahs.map((surah) => (
                    <ComboboxItem key={surah.number} value={String(surah.number)} className="text-xs px-2.5 py-1.5">
                      <div className="flex items-center justify-between w-full pr-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center min-w-[2rem] px-1 py-0.5 bg-muted/80 text-[10px] font-mono font-medium text-muted-foreground">
                            {String(surah.number).padStart(3, "0")}
                          </span>
                          <span className="font-medium text-foreground">{surah.nameLatin}</span>
                        </div>
                        <span className="text-[11px] font-arabic-display text-muted-foreground/80">{surah.name}</span>
                      </div>
                    </ComboboxItem>
                  ))}
                  <ComboboxEmpty>No surah found</ComboboxEmpty>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        </div>
      </div>

      {/* Row 2: Advanced filters - Unified left-aligned flow */}
      <div className="flex flex-wrap items-center justify-start gap-4 border-t border-border/40 pt-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))
        ) : (
          <>
            {/* Revelation Tabs */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Revelation:
              </span>
              <Tabs value={revelationFilter} onValueChange={(val) => onRevelationFilterChange(val)}>
                <TabsList variant="default" className="h-9">
                  {REVELATION_FILTERS.map((filter) => (
                    <TabsTrigger key={filter} value={filter} className="text-[10px]">
                      {filter}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Ayah Count Combobox (Length Filter) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Length:</span>
              <Combobox
                items={AYAH_COUNT_FILTERS.map((opt) => opt.value)}
                value={ayahRange}
                onValueChange={(val) => {
                  if (val) onAyahRangeChange(val as AyahCountRangeKey);
                }}
              >
                <ComboboxInput
                  placeholder="Filter length..."
                  className="w-[150px] h-9 text-xs"
                />
                <ComboboxContent className="w-[180px] z-50">
                  <ComboboxList>
                    {AYAH_COUNT_FILTERS.map((opt) => (
                      <ComboboxItem key={opt.value} value={opt.value} className="text-xs">
                        <span className="font-medium">{opt.label}</span>
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>No length option found</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Sorting Combobox (Sort Filter) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort:
              </span>
              <Combobox
                items={SURAH_SORT_OPTIONS.map((opt) => opt.value)}
                value={sortKey}
                onValueChange={(val) => {
                  if (val) onSortKeyChange(val as SurahSortKey);
                }}
              >
                <ComboboxInput
                  placeholder="Sort by..."
                  className="w-[170px] h-9 text-xs"
                />
                <ComboboxContent className="w-[190px] z-50">
                  <ComboboxList>
                    {SURAH_SORT_OPTIONS.map((opt) => (
                      <ComboboxItem key={opt.value} value={opt.value} className="text-xs">
                        <span className="font-medium">{opt.label}</span>
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>No sort option found</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Reset Filters button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              disabled={!isFiltered}
              tabIndex={isFiltered ? 0 : -1}
              className={cn(
                "h-9 px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all duration-200",
                isFiltered
                  ? "opacity-100 scale-100 pointer-events-auto visible"
                  : "opacity-0 scale-95 pointer-events-none invisible"
              )}
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
