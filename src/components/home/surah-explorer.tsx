"use client";

import { Search, Filter, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSurahSearch } from "@/hooks/use-surah-search";
import type { RevelationFilter } from "@/hooks/use-surah-search";

const REVELATION_FILTERS: RevelationFilter[] = ["All", "Makkiyah", "Madaniyah"];

export function SurahExplorer() {
  const { query, setQuery, revelationFilter, setRevelationFilter, filteredSurahs, totalCount } =
    useSurahSearch();

  return (
    <section id="surah-explorer" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Surah Explorer</h2>
        <p className="mt-2 text-muted-foreground">
          Browse all {totalCount} surahs of the Holy Quran with Arabic names, translations, and metadata.
        </p>
      </div>

      {/* Search & filter controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name, translation, or number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {REVELATION_FILTERS.map((filter) => (
            <Badge
              key={filter}
              variant={revelationFilter === filter ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => setRevelationFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
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
            className="group transition-all duration-200 hover:border-primary/40 hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{surah.nameLatin}</p>
                  <p className="text-xs text-muted-foreground">{surah.translationIdName}</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                  {surah.number}
                </div>
              </div>
              <p className="mt-3 text-right font-sans text-2xl leading-relaxed text-foreground" dir="rtl">
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
