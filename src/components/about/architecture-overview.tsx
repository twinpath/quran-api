import { ARCH_LAYERS, SITE_NAME } from "@/constants";


export function ArchitectureOverview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Architecture</h2>
        <p className="mt-2 text-muted-foreground">
          How {SITE_NAME} delivers sub-15ms responses worldwide through edge infrastructure.
        </p>
      </div>

      {/* Architecture flow */}
      <div className="relative mx-auto max-w-2xl space-y-0">
        {ARCH_LAYERS.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <div key={layer.title} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Vertical connector line */}
              {index < ARCH_LAYERS.length - 1 && (
                <div className="absolute left-[19px] top-10 h-full w-px bg-border" />
              )}

              {/* Icon */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary">
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="pt-1">
                <h3 className="text-sm font-semibold">{layer.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {layer.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
