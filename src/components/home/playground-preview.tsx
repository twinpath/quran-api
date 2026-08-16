import Link from "next/link";
import { Terminal, Play, ArrowRight, Code2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PLAYGROUND_SAMPLE_RESPONSE } from "@/constants";

export function PlaygroundPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-border bg-card/60 p-8 shadow-sm backdrop-blur-sm sm:p-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-6">
            <Badge variant="secondary" className="gap-1.5 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              Interactive Console
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Test APIs Live in the Playground
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Experience instant query execution and examine live JSON response payloads directly in your browser. Choose endpoints, tune path parameters, and grab copy-pasteable code snippets for cURL, JavaScript, Python, and Go.
            </p>
            <div className="pt-2">
              <Link
                href="/playground"
                className={cn(buttonVariants({ variant: "default", size: "default" }), "gap-2")}
              >
                Open API Playground
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card className="border-border/80 bg-background/80 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-xs">GET</Badge>
                    <span className="font-mono text-xs text-muted-foreground">/api/surah/1</span>
                  </div>
                  <Badge variant="outline" className="gap-1 font-mono text-[10px] text-primary">
                    <Play className="h-3 w-3 fill-primary" />
                    200 OK
                  </Badge>
                </div>
                <div className="mt-4 rounded-lg border border-border/40 bg-muted/40 p-4 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground">
                    <Code2 className="h-4 w-4 text-primary" />
                    <span>Response Payload (Al-Fatihah)</span>
                  </div>
                  <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-foreground/80">
                    {PLAYGROUND_SAMPLE_RESPONSE}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
