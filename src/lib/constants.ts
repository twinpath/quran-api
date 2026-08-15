import type { NavItem, FooterSection, StatItem, FaqItem, FeatureItem, Contributor } from "@/types/navigation";

/** Site-wide metadata */
export const SITE_NAME = "Quran JSON";
export const SITE_DESCRIPTION =
  "Free, open-source Al-Quran REST API delivering accurate Arabic text, Indonesian translations, and Tafsir Kemenag RI as clean JSON at the edge.";
export const SITE_URL = "https://quran.dyzulk.com";

/** GitHub repository */
export const GITHUB_REPO_URL = "https://github.com/twinpath/quran-json";
export const GITHUB_REPO_OWNER = "twinpath";
export const GITHUB_REPO_NAME = "quran-json";

/** Data source attribution */
export const DATA_SOURCE_NAME = "Kementerian Agama Republik Indonesia";
export const DATA_SOURCE_URL = "https://quran.kemenag.go.id";
export const ORIGINAL_AUTHOR = "Rio Astamal";
export const ORIGINAL_AUTHOR_EMAIL = "rio@rioastamal.net";
export const LICENSE = "MIT";

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

/** Navigation items */
export const NAV_ITEMS: NavItem[] = [
  { label: "API Playground", href: "/#api-playground" },
  { label: "Surah Explorer", href: "/#surah-explorer" },
  { label: "Quickstart", href: "/#quickstart" },
  { label: "About", href: "/about" },
];

/** Footer sections */
export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "API Playground", href: "/#api-playground" },
      { label: "Surah Explorer", href: "/#surah-explorer" },
      { label: "Quickstart", href: "/#quickstart" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub Repository", href: GITHUB_REPO_URL, external: true },
      { label: "Kemenag RI", href: DATA_SOURCE_URL, external: true },
      { label: "License (MIT)", href: `${GITHUB_REPO_URL}/blob/data/LICENSE.md`, external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Issues", href: `${GITHUB_REPO_URL}/issues`, external: true },
      { label: "Pull Requests", href: `${GITHUB_REPO_URL}/pulls`, external: true },
      { label: "Discussions", href: `${GITHUB_REPO_URL}/discussions`, external: true },
    ],
  },
];

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

/** FAQ items */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Where does the Quran data come from?",
    answer:
      "The Arabic text, Indonesian translations, and Tafsir are sourced from the official application of Kementerian Agama Republik Indonesia (Kemenag RI) at quran.kemenag.go.id. The original dataset was compiled by Rio Astamal.",
  },
  {
    question: "Is this API free to use?",
    answer:
      "Yes, completely free with no API keys, no authentication, and no rate limits. The project is MIT licensed and open source.",
  },
  {
    question: "What is the response format?",
    answer:
      'All responses are JSON. Each surah file is keyed by surah number as a string (e.g. "1") and contains Arabic text, Indonesian translation, and Kemenag Tafsir.',
  },
  {
    question: "Can I self-host this?",
    answer:
      "Absolutely. Clone the repository, run the Next.js build with OpenNext, and deploy to Cloudflare Workers or any compatible runtime.",
  },
  {
    question: "What translations are available?",
    answer:
      "Currently Indonesian (Bahasa Indonesia) translations from Kemenag RI are included. Community contributions for additional languages are welcome via Pull Requests.",
  },
  {
    question: "How accurate is the Arabic text?",
    answer:
      "The Arabic text includes full diacritical marks (harakat) and follows the Uthmani script standard as provided by the Kemenag RI application.",
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
