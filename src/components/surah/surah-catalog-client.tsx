"use client";

import { useState } from "react";
import { Search, Filter, BookOpen, X, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { useSurahSearch } from "@/hooks/use-surah-search";
import { REVELATION_FILTERS, SURAH_SORT_OPTIONS, AYAH_COUNT_FILTERS } from "@/constants";
import type { ApiSurahListItem, AyahCountRangeKey, SurahSortKey } from "@/types/api";

interface SurahCatalogClientProps {
  initialSurahs: ApiSurahListItem[];
}

export function SurahCatalogClient({ initialSurahs }: SurahCatalogClientProps) {
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
  } = useSurahSearch(initialSurahs);

  const [comboboxValue, setComboboxValue] = useState("");

  const handleSurahSelect = (numberVal: string) => {
    if (!numberVal) return;
    resetFilters();
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
  };

  return (
    <section id="surah-catalog" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Surah Catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all {totalCount} surahs of the Holy Quran with Arabic script, Latin transliterations, official Kemenag RI translations, and metadata.
        </p>
      </div>

      {/* Search & filter controls */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Row 1: Search Bar & Combobox Quick Jump */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 h-10 w-full"
              placeholder="Search by name, translation, or number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Combobox
              items={initialSurahs.map((surah) => String(surah.number))}
              value={comboboxValue}
              onValueChange={(val) => {
                if (val) {
                  handleSurahSelect(val);
                  setComboboxValue("");
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
                  {initialSurahs.map((surah) => (
                    <ComboboxItem key={surah.number} value={String(surah.number)} className="text-xs px-2.5 py-1.5">
                      <div className="flex items-center justify-between w-full pr-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center min-w-[2rem] px-1 py-0.5 rounded bg-muted/80 text-[10px] font-mono font-medium text-muted-foreground">
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
          </div>
        </div>

        {/* Row 2: Advanced filters - Unified left-aligned flow */}
        <div className="flex flex-wrap items-center justify-start gap-4 border-t border-border/40 pt-4">
          {/* Revelation Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Revelation:
            </span>
            <Tabs value={revelationFilter} onValueChange={(val) => setRevelationFilter(val)}>
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
                if (val) setAyahRange(val as AyahCountRangeKey);
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
                if (val) setSortKey(val as SurahSortKey);
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

          {/* Reset Filters button - Persistent layout to prevent layout shift */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
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
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filteredSurahs.length} of {totalCount} surahs
      </p>

      {/* Surah grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSurahs.map((surah) => (
          <Card
            key={surah.number}
            id={`surah-${surah.number}`}
            className="group transition-all duration-200 hover:border-primary/40 hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{surah.nameLatin}</p>
                  <p className="text-xs text-muted-foreground">{surah.translationName}</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                  {surah.number}
                </div>
              </div>
              <p className="mt-3 text-right font-arabic-display text-2xl leading-relaxed text-foreground" dir="rtl">
                {surah.name}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">
                  {surah.revelationType}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  {surah.numberOfAyah} ayahs
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
