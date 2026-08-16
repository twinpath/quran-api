import { PRINCIPLES, SITE_NAME } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";


export function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              {SITE_NAME}
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {SITE_NAME} was born from a simple need: lightweight, accurate, and fast access to the Holy Quran in a developer-friendly format. What started as a personal project by Rio Astamal to create a static Quran reader for his Blackberry Passport has grown into a modern edge-delivered API serving developers worldwide.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PRINCIPLES.map((principle) => {
            const Icon = principle.icon;
            return (
              <Card key={principle.title} className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
