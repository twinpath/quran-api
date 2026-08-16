import type { FeatureItem } from "@/types/navigation";

/** Features */
export const FEATURES: FeatureItem[] = [
  {
    title: "Sub-Millisecond Edge Delivery",
    description: "Served from Cloudflare Workers across 300+ edge locations worldwide for ultra-low latency responses.",
    iconName: "Zap",
  },
  {
    title: "Clean JSON Schema",
    description: "Well-structured JSON with consistent field naming, string-keyed ayah records, and predictable response shapes.",
    iconName: "FileJson",
  },
  {
    title: "Kemenag Standard Accuracy",
    description: "Arabic text, Indonesian translations, and Tafsir sourced directly from the official Kementerian Agama RI application.",
    iconName: "ShieldCheck",
  },
  {
    title: "Tafsir Included",
    description: "Every ayah includes detailed Tafsir from Kemenag RI, providing comprehensive interpretation and context.",
    iconName: "BookMarked",
  },
  {
    title: "D1 & KV Edge Infrastructure",
    description: "Queries are powered by Cloudflare D1 serverless database, with KV namespaces for optimized cache retrieval.",
    iconName: "Database",
  },
  {
    title: "100% Free & Open Source",
    description: "MIT licensed. No API keys required. Rate limited to 60 requests/minute to prevent abuse. Fork it or self-host it.",
    iconName: "Globe",
  },
];
