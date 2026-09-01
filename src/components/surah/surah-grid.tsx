"use client";

import { BookOpen, X, SearchX, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SurahGridProps } from "@/types";

export function SurahGrid({
  isLoading,
  filteredSurahs,
  totalCount,
  isFiltered,
  onResetFilters,
  onRetryFetch,
}: SurahGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <div className="mt-3 text-right" dir="rtl">
                <Skeleton className="my-1 h-8 w-full" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredSurahs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border/80 bg-card/50 p-8">
        <SearchX className="h-10 w-10 text-muted-foreground/60 mb-3" />
        <h3 className="text-base font-semibold text-foreground">
          {totalCount > 0 ? "No surahs found" : "Surah data unavailable"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
          {totalCount > 0
            ? "No surahs match your current filter and search criteria."
            : "Unable to load surah catalog data at this moment."}
        </p>
        {totalCount > 0 && isFiltered ? (
          <Button variant="outline" size="sm" onClick={onResetFilters} className="gap-2 text-xs">
            <X className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onRetryFetch} className="gap-2 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Loading
          </Button>
        )}
      </div>
    );
  }

  return (
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
                <div className="text-sm font-medium text-foreground">{surah.nameLatin}</div>
                <div className="text-xs text-muted-foreground">{surah.translationName}</div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                {surah.number}
              </div>
            </div>
            <div className="mt-3 text-right font-arabic-display text-2xl leading-relaxed text-foreground" dir="rtl">
              {surah.name}
            </div>
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
  );
}
