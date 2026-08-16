"use client";

import { useState } from "react";
import { Search, Filter, BookOpen, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { ApiSurahListItem } from "@/types/api";

interface SurahExplorerClientProps {
  initialSurahs: ApiSurahListItem[];
}

export function SurahExplorerClient({ initialSurahs }: SurahExplorerClientProps) {
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
    <section id="surah-explorer" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Surah Explorer</h2>
        <p className="mt-2 text-muted-foreground">
          Browse all {totalCount} surahs of the Holy Quran with Arabic names, translations, and metadata.
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
                className="w-full sm:w-[200px]"
                showClear
              />
              <ComboboxContent className="w-[200px] z-50">
                <ComboboxList>
                  {initialSurahs.map((surah) => (
                    <ComboboxItem key={surah.number} value={String(surah.number)}>
                      <span className="text-muted-foreground mr-1.5 text-xs font-mono">
                        {String(surah.number).padStart(3, "0")}
                      </span>
                      {surah.nameLatin}
                    </ComboboxItem>
                  ))}
                  <ComboboxEmpty>No surah found</ComboboxEmpty>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>

        {/* Row 2: Advanced filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
          <div className="flex flex-wrap items-center gap-3">
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

            {/* Ayah Count Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Length:</span>
              <Select value={ayahRange} onValueChange={(val) => setAyahRange(val as any)}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Any Length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {AYAH_COUNT_FILTERS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort:
              </span>
              <Select value={sortKey} onValueChange={(val) => setSortKey(val as any)}>
                <SelectTrigger className="w-[170px] h-9 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SURAH_SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filters button */}
            {isFiltered && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filteredSurahs.length} of {totalCount} surahs
      </p>

      {/* Surah grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSurahs.slice(0, 18).map((surah) => (
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

      {filteredSurahs.length > 18 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Showing first 18 results. Refine your search to see more.
        </p>
      )}
    </section>
  );
}
