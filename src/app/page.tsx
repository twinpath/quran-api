import { Suspense } from "react";
import { HomeHero } from "@/components/home/home-hero";
import { StatsOverview } from "@/components/home/stats-overview";
import { StatsSkeleton } from "@/components/home/stats-skeleton";
import { ApiPlayground } from "@/components/home/api-playground";
import { ApiPlaygroundSkeleton } from "@/components/home/api-playground-skeleton";
import { SurahExplorer } from "@/components/home/surah-explorer";
import { SurahExplorerSkeleton } from "@/components/home/surah-explorer-skeleton";
import { FeaturesSection } from "@/components/home/features-section";
import { QuickstartSection } from "@/components/home/quickstart-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaBanner } from "@/components/home/cta-banner";

export default function Home() {
  return (
    <>
      <HomeHero />

      <Suspense fallback={<StatsSkeleton />}>
        <StatsOverview />
      </Suspense>

      <Suspense fallback={<ApiPlaygroundSkeleton />}>
        <ApiPlayground />
      </Suspense>

      <FeaturesSection />

      <Suspense fallback={<SurahExplorerSkeleton />}>
        <SurahExplorer />
      </Suspense>

      <QuickstartSection />

      <FaqSection />

      <CtaBanner />
    </>
  );
}
