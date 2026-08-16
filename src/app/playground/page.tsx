import { Suspense } from "react";
import type { Metadata } from "next";
import { ApiPlayground } from "@/components/playground/api-playground";
import { ApiPlaygroundSkeleton } from "@/components/playground/api-playground-skeleton";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `API Playground | ${SITE_NAME}`,
  description: "Interactively test and explore Quran Edge API endpoints, query parameters, live JSON responses, and code snippets.",
};

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen py-8">
      <Suspense fallback={<ApiPlaygroundSkeleton />}>
        <ApiPlayground />
      </Suspense>
    </main>
  );
}
