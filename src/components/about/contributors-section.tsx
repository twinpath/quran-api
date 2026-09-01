import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTRIBUTORS, GITHUB_REPO_URL, SITE_NAME } from "@/constants";

export function ContributorsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Contributors</h2>
        <p className="mt-2 text-muted-foreground">
          The people and organizations behind {SITE_NAME}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONTRIBUTORS.map((contributor) => (
          <Card key={contributor.name}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="font-semibold">{contributor.name}</p>
                <p className="text-sm text-muted-foreground">{contributor.role}</p>
              </div>
              {contributor.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  render={<a href={contributor.url} target="_blank" rel="noopener noreferrer" />}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Visit {contributor.name}</span>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 border border-dashed border-border p-6 text-center">
        <p className="text-sm font-medium">Want to contribute?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We welcome Pull Requests for translations, bug fixes, and feature improvements.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 gap-2"
          nativeButton={false}
          render={<a href={`${GITHUB_REPO_URL}/pulls`} target="_blank" rel="noopener noreferrer" />}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open a Pull Request
        </Button>
      </div>
    </section>
  );
}
