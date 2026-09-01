import Link from "next/link";
import { BookOpen, Search, ArrowRight, Layers } from "lucide-react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchSurahList } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LoadingProps } from "@/types/components";

export async function SurahPreview({ isLoading }: LoadingProps = {}) {
  let surahList: Array<{ number: string | number; nameLatin: string; translationName: string; name: string; revelationType: string; numberOfAyah: string | number }> = [];
  if (!isLoading) {
    try {
      const { env } = getCloudflareContext();
      surahList = await fetchSurahList(env);
    } catch {
      surahList = await fetchSurahList();
    }
  }

  const previewSurahs = isLoading || surahList.length === 0
    ? [
        { number: 1, nameLatin: "", translationName: "", name: "", revelationType: "", numberOfAyah: "" },
        { number: 2, nameLatin: "", translationName: "", name: "", revelationType: "", numberOfAyah: "" },
        { number: 3, nameLatin: "", translationName: "", name: "", revelationType: "", numberOfAyah: "" },
      ]
    : surahList.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center">
        {isLoading ? (
          <Skeleton className="mb-3 h-5 w-36" />
        ) : (
          <Badge variant="secondary" className="mb-3 gap-1.5 font-mono text-xs">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Live Dataset Preview
          </Badge>
        )}

        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {isLoading ? <Skeleton className="h-9 w-80" /> : "Explore the Complete Surah Catalog"}
        </h2>

        <div className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          {isLoading ? (
            <Skeleton className="mx-auto h-4 w-96" />
          ) : (
            `Access all ${surahList.length > 0 ? surahList.length : 114} surahs of the Holy Quran powered by Cloudflare D1 and edge caching, complete with Arabic script, transliterations, and Kemenag RI translations.`
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {previewSurahs.map((surah, idx) => (
          <Card key={surah.number || idx} className="transition-all duration-200 hover:border-primary/40 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-foreground">
                    {isLoading ? <Skeleton className="h-4 w-24" /> : surah.nameLatin}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isLoading ? <Skeleton className="mt-1 h-3 w-16" /> : surah.translationName}
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center border border-border text-xs font-semibold text-muted-foreground">
                  {isLoading ? <Skeleton className="h-4 w-4" /> : surah.number}
                </div>
              </div>
              <div className="mt-3 text-right font-arabic-display text-2xl leading-relaxed text-foreground" dir="rtl">
                {isLoading ? <Skeleton className="my-1 h-8 w-full" /> : surah.name}
              </div>
              <div className="mt-3 flex items-center justify-between">
                {isLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    {surah.revelationType}
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isLoading ? (
                    <Skeleton className="h-3 w-14" />
                  ) : (
                    <>
                      <Layers className="h-3 w-3" />
                      {surah.numberOfAyah} ayahs
                    </>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {isLoading ? (
          <Skeleton className="h-10 w-64" />
        ) : (
          <Link
            href="/surah"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "gap-2")}
          >
            <Search className="h-4 w-4" />
            Browse Full Catalog ({surahList.length > 0 ? surahList.length : 114} Surahs)
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  );
}


