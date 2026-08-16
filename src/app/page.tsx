import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeHero } from "@/components/home/home-hero";
import { StatsOverview } from "@/components/home/stats-overview";
import { StatsSkeleton } from "@/components/home/stats-skeleton";
import { PlaygroundPreview } from "@/components/home/playground-preview";
import { FeaturesSection } from "@/components/home/features-section";
import { SurahPreview } from "@/components/home/surah-preview";
import { SurahPreviewSkeleton } from "@/components/home/surah-preview-skeleton";
import { QuickstartSection } from "@/components/home/quickstart-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaBanner } from "@/components/home/cta-banner";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.home.title,
  description: SITE_PAGE_METADATA.home.description,
  path: SITE_PAGE_METADATA.home.path,
});

export default function Home() {
  return (
    <>
      <HomeHero />

      <Suspense fallback={<StatsSkeleton />}>
        <StatsOverview />
      </Suspense>

      <PlaygroundPreview />

      <FeaturesSection />

      <Suspense fallback={<SurahPreviewSkeleton />}>
        <SurahPreview />
      </Suspense>

      <QuickstartSection />

      <FaqSection />

      <CtaBanner />
    </>
  );
}
