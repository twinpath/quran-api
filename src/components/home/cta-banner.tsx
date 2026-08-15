import { GitFork, Terminal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB_REPO_URL } from "@/lib/constants";

export function CtaBanner() {
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 text-center">
          {/* Decorative blur */}
          <div className="pointer-events-none absolute -top-20 right-0 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />

          <h2 className="relative font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to build with Quran JSON?
          </h2>
          <p className="relative mt-3 text-muted-foreground">
            Start integrating accurate Quran data into your application today. Free forever, no API key required.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2" nativeButton={false} render={<a href="#api-playground" />}>
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
              <GitFork className="h-4 w-4" />
              Star on GitHub
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
