import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutHero } from "@/components/about/about-hero";
import { DatasetLineage } from "@/components/about/dataset-lineage";
import { ArchitectureOverview } from "@/components/about/architecture-overview";
import { ContributorsSection } from "@/components/about/contributors-section";
import { CtaBanner } from "@/components/home/cta-banner";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.about.title,
  description: SITE_PAGE_METADATA.about.description,
  path: SITE_PAGE_METADATA.about.path,
});

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutHero isLoading />}>
      <AboutHero />
      <DatasetLineage />
      <ArchitectureOverview />
      <ContributorsSection />
      <CtaBanner />
    </Suspense>
  );
}

