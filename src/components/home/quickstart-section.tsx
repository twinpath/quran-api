"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/common/code-block";
import { SITE_URL, API_PATHS, QUICKSTART_SNIPPETS, SITE_NAME } from "@/constants";

export function QuickstartSection() {
  return (
    <section id="quickstart" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Quickstart</h2>
        <p className="mt-2 text-muted-foreground">
          Get started with {SITE_NAME} in under a minute. Pick your language and copy the snippet.
        </p>
      </div>

      <Tabs defaultValue="curl" className="mx-auto max-w-3xl">
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="inline-flex min-w-full justify-start w-max">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="fetch">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
          </TabsList>
        </div>

        {Object.entries(QUICKSTART_SNIPPETS).map(([key, code]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <CodeBlock
              code={code}
              language={key === "fetch" ? "javascript" : key}
              showLineNumbers
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
