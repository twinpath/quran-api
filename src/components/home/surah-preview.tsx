import Link from "next/link";
import { BookOpen, Search, ArrowRight, Layers } from "lucide-react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchSurahList } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function SurahPreview() {
  let surahList = [];
  try {
    const { env } = getCloudflareContext();
    surahList = await fetchSurahList(env);
  } catch {
    surahList = await fetchSurahList();
  }

  // Display the first 3 real surahs from live database/catalog data
  const previewSurahs = surahList.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5 font-mono text-xs">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          Live Dataset Preview
        </Badge>
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Explore the Complete Surah Catalog
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          Access all {surahList.length > 0 ? surahList.length : 114} surahs of the Holy Quran powered by Cloudflare D1 and edge caching, complete with Arabic script, transliterations, and Kemenag RI translations.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {previewSurahs.map((surah) => (
          <Card key={surah.number} className="transition-all duration-200 hover:border-primary/40 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{surah.nameLatin}</p>
                  <p className="text-xs text-muted-foreground">{surah.translationName}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                  {surah.number}
                </div>
              </div>
              <p className="mt-3 text-right font-arabic-display text-2xl leading-relaxed text-foreground" dir="rtl">
                {surah.name}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">
                  {surah.revelationType}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Layers className="h-3 w-3" />
                  {surah.numberOfAyah} ayahs
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/surah"
          className={cn(buttonVariants({ variant: "default", size: "lg" }), "gap-2")}
        >
          <Search className="h-4 w-4" />
          Browse Full Catalog ({surahList.length > 0 ? surahList.length : 114} Surahs)
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
