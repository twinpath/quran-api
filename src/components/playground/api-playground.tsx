"use client";

import { Play, Loader2, CircleCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CodeBlock } from "@/components/common/code-block";
import { JsonViewer } from "@/components/common/json-viewer";
import { useApiPlayground } from "@/hooks/use-api-playground";
import { SNIPPET_LANG_LABELS } from "@/lib/api-endpoints";
import { formatLatency } from "@/lib/formatters";
import type { CodeSnippetLang } from "@/types/api";
import { SITE_NAME } from "@/constants";

export function ApiPlayground() {
  const {
    state,
    selectedEndpoint,
    endpoints,
    resolvedUrl,
    codeSnippet,
    selectEndpoint,
    setParamValue,
    setSnippetLang,
    executeRequest,
  } = useApiPlayground();

  return (
    <section id="api-playground" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">API Playground</h1>
        <p className="mt-2 text-muted-foreground">
          Explore the {SITE_NAME} interactively. Select an endpoint, adjust parameters, and view live responses.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Endpoint selector */}
        <div className="border-b border-border p-4">
          <div className="flex flex-wrap gap-2">
            {endpoints.map((ep) => (
              <Button
                key={ep.id}
                variant={state.selectedEndpointId === ep.id ? "default" : "outline"}
                size="sm"
                onClick={() => selectEndpoint(ep.id)}
              >
                {ep.name}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{selectedEndpoint.description}</p>
        </div>

        {/* URL bar and params */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="shrink-0 font-mono text-xs">
              {selectedEndpoint.method}
            </Badge>
            <code className="flex-1 truncate text-sm text-muted-foreground">{resolvedUrl}</code>
            <Button
              size="sm"
              className="gap-2"
              onClick={executeRequest}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Send
            </Button>
          </div>

          {/* Path params */}
          {selectedEndpoint.pathParams.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedEndpoint.pathParams.map((param) => (
                <div key={param.name} className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground">{param.name}:</label>
                  <Input
                    className="h-8 w-24 font-mono text-sm"
                    placeholder={param.defaultValue}
                    value={state.paramValues[param.name] ?? ""}
                    onChange={(e) => setParamValue(param.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Response area */}
        <div className="p-4">
          {state.response && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                <CircleCheck className="h-3 w-3 text-primary" />
                {state.response.status} {state.response.statusText}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 font-mono text-xs" title="Physical HTTP network round-trip time from browser">
                <Clock className="h-3 w-3" />
                Network: {formatLatency(state.response.latencyMs)}
              </Badge>
              {typeof state.response.serverTimeMs === "number" && (
                <Badge variant="secondary" className="gap-1.5 font-mono text-xs" title="Internal server execution time from JSON response meta">
                  <Clock className="h-3 w-3 text-primary" />
                  Server: {formatLatency(state.response.serverTimeMs)}
                </Badge>
              )}
            </div>
          )}

          <Tabs defaultValue="response" className="w-full">
            <div className="w-full overflow-x-auto pb-1">
              <TabsList className="inline-flex min-w-full justify-start w-max">
                <TabsTrigger value="response">Response</TabsTrigger>
                {(Object.keys(SNIPPET_LANG_LABELS) as CodeSnippetLang[]).map((lang) => (
                  <TabsTrigger key={lang} value={lang} onClick={() => setSnippetLang(lang)} className="flex-initial">
                    {SNIPPET_LANG_LABELS[lang]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="response" className="mt-4">
              {state.response ? (
                <JsonViewer data={state.response.data} maxHeight="420px" />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                  Click &quot;Send&quot; to execute the request
                </div>
              )}
            </TabsContent>

            {(Object.keys(SNIPPET_LANG_LABELS) as CodeSnippetLang[]).map((lang) => (
              <TabsContent key={lang} value={lang} className="mt-4">
                <CodeBlock code={codeSnippet} language={SNIPPET_LANG_LABELS[lang]} showLineNumbers />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
