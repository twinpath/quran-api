import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutHero } from "@/components/about/about-hero";
import { DatasetLineage } from "@/components/about/dataset-lineage";
import { ArchitectureOverview } from "@/components/about/architecture-overview";
import { ContributorsSection } from "@/components/about/contributors-section";
import { AboutSkeleton } from "@/components/about/about-skeleton";
import { CtaBanner } from "@/components/home/cta-banner";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    `Learn about the ${SITE_NAME} project, its dataset lineage, edge architecture, and how to contribute.`,
};

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutHero />
      <DatasetLineage />
      <ArchitectureOverview />
      <ContributorsSection />
      <CtaBanner />
    </Suspense>
  );
}
