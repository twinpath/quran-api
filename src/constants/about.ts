import {
  Heart,
  Target,
  Sparkles,
  Server,
  Globe,
  Zap,
  HardDrive,
  Database,
  FileText,
  ShieldCheck,
  Languages
} from "lucide-react";
import type { StatItem, Contributor } from "@/types/navigation";
import { DATA_SOURCE_NAME, DATA_SOURCE_URL, ORIGINAL_AUTHOR } from "./site";

/** Global statistics */
export const STATS: StatItem[] = [
  {
    label: "Surahs",
    value: "114",
    iconName: "BookOpen",
    description: "Complete chapters of the Holy Quran",
  },
  {
    label: "Ayahs",
    value: "6,236",
    iconName: "ScrollText",
    description: "Verses with Arabic text and translations",
  },
  {
    label: "Juz",
    value: "30",
    iconName: "Layers",
    description: "Traditional divisions of the Quran",
  },
  {
    label: "Response Time",
    value: "<15ms",
    iconName: "Zap",
    description: "Edge-delivered from Cloudflare Workers",
  },
];

/** Contributors */
export const CONTRIBUTORS: Contributor[] = [
  {
    name: "Rio Astamal",
    role: "Original Dataset Author",
    url: "https://github.com/rioastamal",
  },
  {
    name: "Twinpath",
    role: "Edge API & Web Application",
    url: "https://github.com/twinpath",
  },
];

/** Core Principles (from about-hero.tsx) */
export const PRINCIPLES = [
  {
    icon: Target,
    title: "Accuracy",
    description: "Sourced directly from the official Kemenag RI application with full diacritical marks and verified translations.",
  },
  {
    icon: Sparkles,
    title: "Speed",
    description: "Edge-delivered via Cloudflare Workers across 300+ locations for sub-15ms response times worldwide.",
  },
  {
    icon: Heart,
    title: "Openness",
    description: "MIT licensed, no API keys, no rate limits, no tracking. Fork it, self-host it, or use our CDN.",
  },
];

/** Architecture Layers (from architecture-overview.tsx) */
export const ARCH_LAYERS = [
  {
    icon: Globe,
    title: "Client Request",
    description: "Users and applications send HTTP requests to the Quran JSON domain.",
  },
  {
    icon: Zap,
    title: "Cloudflare Edge (300+ PoPs)",
    description: "Requests hit the nearest Cloudflare edge node. Static surah JSON files are served directly from the CDN with immutable caching headers.",
  },
  {
    icon: Server,
    title: "Cloudflare Workers (OpenNext SSR)",
    description: "Dynamic pages and API routes are rendered on Cloudflare Workers using the OpenNext adapter for Next.js, running full server-side rendering at the edge.",
  },
  {
    icon: HardDrive,
    title: "Static Assets",
    description: "Pre-built surah JSON files (1.json - 114.json and 001.json - 114.json) are served as static assets with Cache-Control: public, max-age=31536000, immutable.",
  },
];

/** Dataset Lineage Items (from dataset-lineage.tsx) */
export const LINEAGE_ITEMS = [
  {
    icon: Database,
    title: "Primary Source",
    description: `Arabic text, Indonesian translations, and Tafsir are sourced from the official application of ${DATA_SOURCE_NAME}.`,
    link: { label: "quran.kemenag.go.id", href: DATA_SOURCE_URL },
  },
  {
    icon: FileText,
    title: "Generator Pipeline",
    description: `The dataset is compiled using a Bash generator script (generator.sh) that processes raw text files from the quran-text project into structured JSON, one file per surah.`,
    link: null,
  },
  {
    icon: ShieldCheck,
    title: "Script Integrity",
    description: `Arabic text includes full diacritical marks (harakat) following the Uthmani script standard. Each ayah preserves the original encoding from ${DATA_SOURCE_NAME}.`,
    link: null,
  },
  {
    icon: Languages,
    title: "Translation & Tafsir",
    description: `Indonesian translations and Tafsir Kemenag RI are included for every ayah, providing comprehensive meaning and scholarly interpretation.`,
    link: null,
  },
];
