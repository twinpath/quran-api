import Link from "next/link";
import { Zap } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { FOOTER_SECTIONS, SITE_NAME, DATA_SOURCE_NAME, DATA_SOURCE_URL, ORIGINAL_AUTHOR, LICENSE } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 align-middle font-heading text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
              <Logo size={40} variant="icon" className="shrink-0" />
              <span className="leading-none">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free, open-source Al-Quran API delivering accurate Arabic text, Indonesian translations, and Tafsir Kemenag RI at the edge.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              <span>Edge-delivered via Cloudflare Workers</span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      (() => {
                        const isHash = link.href.includes("#");
                        const className = "text-sm text-muted-foreground transition-colors hover:text-foreground";
                        return isHash ? (
                          <a href={link.href} className={className}>
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className={className}>
                            {link.label}
                          </Link>
                        );
                      })()
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Data source:{" "}
            <a href={DATA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              {DATA_SOURCE_NAME}
            </a>
            . Original dataset by {ORIGINAL_AUTHOR}.
          </p>
          <p className="text-xs text-muted-foreground">
            {LICENSE} License. Built by Twinpath.
          </p>
        </div>
      </div>
    </footer>
  );
}
