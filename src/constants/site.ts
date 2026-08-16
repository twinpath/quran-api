/** Site-wide metadata */
export const SITE_NAME = "Quran Edge API";
export const SITE_DESCRIPTION =
  "Free, open-source Al-Quran REST API delivering accurate Arabic text, Indonesian translations, and Tafsir Kemenag RI as clean JSON at the edge.";
export const SITE_URL = "https://quran.dyzulk.com";
export const SITE_LOCALE = "en_US";
export const SITE_AUTHOR = "Twinpath";
export const SITE_TWITTER_HANDLE = "@twinpath";
export const SITE_IMAGE = "/logo.svg";
export const SITE_IMAGE_URL = `${SITE_URL}${SITE_IMAGE}`;

export const GITHUB_REPO_URL = "https://github.com/twinpath/quran-api";
export const GITHUB_REPO_OWNER = "twinpath";
export const GITHUB_REPO_NAME = "quran-api";

export const SITE_KEYWORDS = [
  "Quran API",
  "Al-Quran REST API",
  "Quran JSON API",
  "Open Quran API",
  "Kemenag Quran API",
  "Tafsir Kemenag API",
  "Quran translations",
  "Islamic API",
  "Surah metadata API",
];

export const SITE_OPEN_GRAPH = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  siteName: SITE_NAME,
  type: "website",
  locale: SITE_LOCALE,
  images: [
    {
      url: SITE_IMAGE_URL,
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} logo`,
    },
  ],
};

export const SITE_TWITTER = {
  card: "summary_large_image",
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  images: [SITE_IMAGE_URL],
  creator: SITE_TWITTER_HANDLE,
  site: SITE_TWITTER_HANDLE,
};

export const SITE_WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: SITE_LOCALE,
  publisher: {
    "@type": "Organization",
    name: SITE_AUTHOR,
    url: SITE_URL,
    logo: SITE_IMAGE_URL,
  },
} as const;

export const SITE_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_IMAGE_URL,
  description: SITE_DESCRIPTION,
  sameAs: [GITHUB_REPO_URL],
  isAccessibleForFree: true,
} as const;

export const SITE_PAGE_METADATA = {
  home: {
    title: "Home",
    description:
      "Access Quran Edge API to retrieve clean Arabic text, translation, Tafsir, and surah metadata in structured JSON format.",
    path: "/",
  },
  about: {
    title: "About",
    description:
      "Learn about the Quran Edge API project, its dataset lineage, edge architecture, and how to contribute to the open-source initiative.",
    path: "/about",
  },
  surah: {
    title: "Surah Catalog",
    description:
      "Browse all 114 surahs in the Holy Quran with Arabic text, Latin transliteration, Kemenag translation, and revelation metadata.",
    path: "/surah",
  },
  playground: {
    title: "API Playground",
    description:
      "Test Quran Edge API endpoints interactively with live JSON responses, code samples, and query parameter exploration.",
    path: "/playground",
  },
  status: {
    title: "API Status & Telemetry",
    description:
      "Monitor real-time API uptime, latency, and global request telemetry for the Quran Edge API platform.",
    path: "/status",
  },
} as const;

/** Data source attribution */
export const DATA_SOURCE_NAME = "Kementerian Agama Republik Indonesia";
export const DATA_SOURCE_URL = "https://quran.kemenag.go.id";
export const ORIGINAL_AUTHOR = "Rio Astamal";
export const ORIGINAL_AUTHOR_EMAIL = "rio@rioastamal.net";
export const LICENSE = "MIT";
