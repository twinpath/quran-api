"use client";

import { Copy, Check } from "lucide-react";
import { Highlight } from "prism-react-renderer";
import { usePrismTheme } from "@/hooks/use-prism-theme";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { JsonViewerProps } from "@/types/components";

export function JsonViewer({ data, className, maxHeight = "400px" }: JsonViewerProps) {
  const { hasCopied, copy } = useCopyToClipboard();
  const prismTheme = usePrismTheme();
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className={cn("group relative rounded-lg border border-border bg-muted/50", className)}>
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          JSON
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => copy(jsonString)}
        >
          {hasCopied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Copy JSON</span>
        </Button>
      </div>
      <div className="overflow-auto p-4 font-mono text-[13px] leading-relaxed" style={{ maxHeight }}>
        <Highlight
          theme={prismTheme}
          code={jsonString}
          language="json"
        >
          {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn("whitespace-pre-wrap break-words", highlightClass)}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => {
                const { key: _lineKey, ...lineProps } = getLineProps({ line, key: i });
                return (
                  <div key={i} {...lineProps}>
                    {line.map((token, tokenIdx) => {
                      const { key: _tokenKey, ...tokenProps } = getTokenProps({ token, key: tokenIdx });
                      return (
                        <span key={tokenIdx} {...tokenProps} />
                      );
                    })}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
