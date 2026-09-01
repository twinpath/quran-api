"use client";


import { Terminal, BookOpen, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/common/code-block";
import { SITE_URL, GITHUB_REPO_URL, API_PATHS } from "@/constants";

export function HomeHero() {
  const curlSnippet = `curl -s ${SITE_URL}${API_PATHS.surahDetail(1)} | jq .`;

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="flex flex-col items-center text-center">
          {/* Edge badge */}
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium">
            <Zap className="h-3 w-3 text-primary" />
            Edge-delivered via Cloudflare Workers
          </Badge>

          {/* Headline */}
          <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Al-Quran API for{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Modern Developers
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Free, open-source REST API serving accurate Arabic text, Indonesian translations,
            and Tafsir Kemenag RI as clean JSON with sub-15ms edge latency.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <Button size="lg" className="gap-2" nativeButton={false} render={<a href="/playground" />}>
              <Terminal className="h-4 w-4" />
              Try the API
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={<a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" />}
            >
              <BookOpen className="h-4 w-4" />
              View on GitHub
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Interactive cURL snippet */}
          <div className="mt-12 w-full max-w-xl">
            <CodeBlock code={curlSnippet} language="curl" />
          </div>
        </div>
      </div>
    </section>
  );
}
