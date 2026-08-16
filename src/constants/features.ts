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
    title: "3-Digit Padded Indexing",
    description: "Surah files available in both standard (1.json) and zero-padded (001.json) naming for flexible integration.",
    iconName: "Hash",
  },
  {
    title: "100% Free & Open Source",
    description: "MIT licensed. No API keys required. No rate limits. Fork it, self-host it, or use our edge CDN.",
    iconName: "Globe",
  },
];
