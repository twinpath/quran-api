import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LINEAGE_ITEMS, DATA_SOURCE_NAME, DATA_SOURCE_URL, ORIGINAL_AUTHOR, SITE_NAME } from "@/constants";

export function DatasetLineage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Dataset Lineage</h2>
        <p className="mt-2 text-muted-foreground">
          Tracing the provenance and accuracy of the {SITE_NAME} dataset. Original dataset authored by {ORIGINAL_AUTHOR}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {LINEAGE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {item.link.label}
                  </a>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
