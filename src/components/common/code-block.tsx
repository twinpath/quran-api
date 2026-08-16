"use client";

import { Copy, Check } from "lucide-react";
import { Highlight } from "prism-react-renderer";
import { Prism } from "@/lib/prism-loader";
import { usePrismTheme } from "@/hooks/use-prism-theme";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { CodeBlockProps } from "@/types/components";

const normalizeLanguage = (lang?: string): string => {
  if (!lang) return "javascript";
  const lower = lang.toLowerCase();
  if (lower === "curl") return "bash";
  return lower;
};

export function CodeBlock({ code, language, className, showLineNumbers = false }: CodeBlockProps) {
  const { hasCopied, copy } = useCopyToClipboard();
  const prismTheme = usePrismTheme();
  const normalizedLang = normalizeLanguage(language);

  return (
    <div className={cn("group relative rounded-lg border border-border bg-muted/50 font-mono text-sm", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        {language && (
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {language}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => copy(code)}
        >
          {hasCopied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto p-4">
        <Highlight
          prism={Prism}
          theme={prismTheme}
          code={code.trim()}
          language={normalizedLang}
        >
          {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn("text-[13px] leading-relaxed", highlightClass)}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => {
                const { key: _lineKey, ...lineProps } = getLineProps({ line, key: i });
                return (
                  <div key={i} {...lineProps} className={cn("flex", lineProps.className)}>
                    {showLineNumbers && (
                      <span className="mr-4 inline-block w-6 select-none text-right text-muted-foreground/50 shrink-0">
                        {i + 1}
                      </span>
                    )}
                    <span className="flex-1">
                      {line.map((token, tokenIdx) => {
                        const { key: _tokenKey, ...tokenProps } = getTokenProps({ token, key: tokenIdx });
                        return (
                          <span key={tokenIdx} {...tokenProps} />
                        );
                      })}
                    </span>
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
