import { PRINCIPLES, SITE_NAME } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LoadingProps } from "@/types/components";

export function AboutHero({ isLoading }: LoadingProps = {}) {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {isLoading ? (
              <Skeleton className="mx-auto h-12 w-64" />
            ) : (
              <h1>
                About{" "}
                <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  {SITE_NAME}
                </span>
              </h1>
            )}
          </div>
          <div className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {isLoading ? (
              <Skeleton className="mx-auto h-20 w-full" />
            ) : (
              <p>
                {SITE_NAME} was born from a simple need: lightweight, accurate, and fast access to the Holy Quran in a developer-friendly format. What started as a personal project by Rio Astamal to create a static Quran reader for his Blackberry Passport has grown into a modern edge-delivered API serving developers worldwide.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PRINCIPLES.map((principle) => {
            const Icon = principle.icon;
            return (
              <Card key={principle.title} className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                    {isLoading ? <Skeleton className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="font-semibold">
                    {isLoading ? <Skeleton className="mx-auto h-5 w-24" /> : principle.title}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {isLoading ? <Skeleton className="mt-1 h-12 w-full" /> : principle.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

