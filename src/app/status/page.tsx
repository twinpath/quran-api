import { Suspense } from "react";
import type { Metadata } from "next";
import { StatusPageClient } from "@/components/status/status-page-client";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.status.title,
  description: SITE_PAGE_METADATA.status.description,
  path: SITE_PAGE_METADATA.status.path,
});

export default function StatusPage() {
  return (
    <Suspense fallback={<StatusPageClient isLoading />}>
      <StatusPageClient />
    </Suspense>
  );
}

