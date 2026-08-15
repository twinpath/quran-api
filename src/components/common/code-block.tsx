"use client";

import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, className, showLineNumbers = false }: CodeBlockProps) {
  const { hasCopied, copy } = useCopyToClipboard();

  const lines = code.split("\n");

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
        <pre className="text-[13px] leading-relaxed">
          {showLineNumbers
            ? lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-6 select-none text-right text-muted-foreground/50">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            : code}
        </pre>
      </div>
    </div>
  );
}
