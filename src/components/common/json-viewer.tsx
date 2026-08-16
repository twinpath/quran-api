"use client";

import { useSyncExternalStore } from "react";
import { Copy, Check } from "lucide-react";
import { Highlight } from "prism-react-renderer";
import { Prism } from "@/lib/prism-loader";
import { usePrismTheme } from "@/hooks/use-prism-theme";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { JsonViewerProps } from "@/types/components";

const emptySubscribe = () => () => {};
function useHasHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function JsonViewer({ data, className, maxHeight = "400px" }: JsonViewerProps) {
  const { hasCopied, copy } = useCopyToClipboard();
  const prismTheme = usePrismTheme();
  const jsonString = JSON.stringify(data, null, 2);
  const mounted = useHasHydrated();

  if (!mounted) {
    return (
      <div className={cn("group relative rounded-lg border border-border bg-muted/50", className)}>
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            JSON
          </span>
          <div className="h-7 w-7" />
        </div>
        <div className="p-4 font-mono text-xs text-muted-foreground" style={{ maxHeight }}>
          <pre className="overflow-x-auto whitespace-pre-wrap">{jsonString}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("group relative rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          JSON Response
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => copy(jsonString)}
          title="Copy JSON"
        >
          {hasCopied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      <Highlight prism={Prism} code={jsonString} language="json" theme={prismTheme}>
        {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
          <div
            className="p-4 font-mono text-xs overflow-auto"
            style={{ maxHeight }}
          >
            <pre
              className={cn("whitespace-pre-wrap break-words", highlightClass)}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line, key: i });
                return (
                  <div key={i} {...lineProps}>
                    {line.map((token, tokenIdx) => {
                      const tokenProps = getTokenProps({ token, key: tokenIdx });
                      return (
                        <span key={tokenIdx} {...tokenProps} />
                      );
                    })}
                  </div>
                );
              })}
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
}
