import type { PrismTheme } from "prism-react-renderer";

/**
 * Custom Prism syntax highlighting theme for light mode.
 * Token colors are chosen for high contrast against the site's
 * near-white bg-muted/50 background (oklch(0.97 0 0)).
 */
export const prismLightTheme: PrismTheme = {
  plain: {
    color: "#1a1a2e",
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#6b7280", fontStyle: "italic" as const },
    },
    {
      types: ["namespace"],
      style: { opacity: 0.7 },
    },
    {
      types: ["string", "attr-value"],
      style: { color: "#059669" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "#475569" },
    },
    {
      types: [
        "entity",
        "url",
        "symbol",
        "number",
        "boolean",
        "variable",
        "constant",
        "regex",
        "inserted",
      ],
      style: { color: "#d97706" },
    },
    {
      types: ["property", "attr-name"],
      style: { color: "#2563eb" },
    },
    {
      types: ["atrule", "keyword"],
      style: { color: "#7c3aed" },
    },
    {
      types: ["function", "deleted", "tag"],
      style: { color: "#c026d3" },
    },
    {
      types: ["function-variable"],
      style: { color: "#c026d3" },
    },
    {
      types: ["selector", "important", "builtin"],
      style: { color: "#2563eb" },
    },
    {
      types: ["class-name"],
      style: { color: "#0d9488" },
    },
    {
      types: ["char"],
      style: { color: "#059669" },
    },
  ],
};

/**
 * Custom Prism syntax highlighting theme for dark mode.
 * Token colors are chosen for high contrast against the site's
 * near-black bg-muted/50 background (oklch(0.269 0 0) at ~50% opacity
 * over oklch(0.145 0 0)).
 */
export const prismDarkTheme: PrismTheme = {
  plain: {
    color: "#e2e8f0",
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#64748b", fontStyle: "italic" as const },
    },
    {
      types: ["namespace"],
      style: { opacity: 0.7 },
    },
    {
      types: ["string", "attr-value"],
      style: { color: "#34d399" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "#94a3b8" },
    },
    {
      types: [
        "entity",
        "url",
        "symbol",
        "number",
        "boolean",
        "variable",
        "constant",
        "regex",
        "inserted",
      ],
      style: { color: "#fbbf24" },
    },
    {
      types: ["property", "attr-name"],
      style: { color: "#60a5fa" },
    },
    {
      types: ["atrule", "keyword"],
      style: { color: "#a78bfa" },
    },
    {
      types: ["function", "deleted", "tag"],
      style: { color: "#e879f9" },
    },
    {
      types: ["function-variable"],
      style: { color: "#e879f9" },
    },
    {
      types: ["selector", "important", "builtin"],
      style: { color: "#60a5fa" },
    },
    {
      types: ["class-name"],
      style: { color: "#2dd4bf" },
    },
    {
      types: ["char"],
      style: { color: "#34d399" },
    },
  ],
};
