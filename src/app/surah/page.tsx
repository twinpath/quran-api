import { Suspense } from "react";
import type { Metadata } from "next";
import { SurahCatalog } from "@/components/surah/surah-catalog";
import { SurahCatalogSkeleton } from "@/components/surah/surah-catalog-skeleton";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.surah.title,
  description: SITE_PAGE_METADATA.surah.description,
  path: SITE_PAGE_METADATA.surah.path,
});

export default function SurahPage() {
  return (
    <main className="min-h-screen py-8">
      <Suspense fallback={<SurahCatalogSkeleton />}>
        <SurahCatalog />
      </Suspense>
    </main>
  );
}
