import { Suspense } from "react";
import type { Metadata } from "next";
import { StatusPageClient } from "@/components/status/status-page-client";
import { StatusSkeleton } from "@/components/status/status-skeleton";
import { STATUS_SITE_METADATA } from "@/constants";

export const metadata: Metadata = {
  title: STATUS_SITE_METADATA.title,
  description: STATUS_SITE_METADATA.description,
};

export default function StatusPage() {
  return (
    <Suspense fallback={<StatusSkeleton />}>
      <StatusPageClient />
    </Suspense>
  );
}
