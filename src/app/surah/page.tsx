import { Suspense } from "react";
import type { Metadata } from "next";
import { SurahCatalog } from "@/components/surah/surah-catalog";
import { SurahCatalogSkeleton } from "@/components/surah/surah-catalog-skeleton";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Surah Catalog | ${SITE_NAME}`,
  description: "Browse all 114 surahs of the Holy Quran with Arabic script, Latin transliterations, official Kemenag RI translations, and revelation metadata.",
};

export default function SurahPage() {
  return (
    <main className="min-h-screen py-8">
      <Suspense fallback={<SurahCatalogSkeleton />}>
        <SurahCatalog />
      </Suspense>
    </main>
  );
}
