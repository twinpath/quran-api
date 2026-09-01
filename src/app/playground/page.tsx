import { Suspense } from "react";
import type { Metadata } from "next";
import { ApiPlayground } from "@/components/playground/api-playground";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.playground.title,
  description: SITE_PAGE_METADATA.playground.description,
  path: SITE_PAGE_METADATA.playground.path,
});

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen py-8">
      <Suspense fallback={<ApiPlayground isLoading />}>
        <ApiPlayground />
      </Suspense>
    </main>
  );
}

