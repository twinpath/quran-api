import type { ApiEndpoint, CodeSnippetLang } from "@/types/api";
import { SAMPLE_ALFATIHAH, SURAH_CATALOG } from "@/lib/quran-data";
import type { RevelationFilter } from "@/hooks/use-surah-search";

/** Centralized API paths for both static files and edge-native routes */
export const API_PATHS = {
  // Edge-native dynamic routes (D1 + KV)
  surahList: "/api/surah",
  surahDetail: (num: string | number) => `/api/surah/${num}`,
  search: (query: string) => `/api/search?q=${query}`,

  // Legacy static files
  staticSurah: (num: string | number) => `/surah/${num}.json`,
  staticSurahPadded: (num: string | number) => `/surah-3digit/${num}.json`,
} as const;

// Programmatic sample data for dynamic Edge APIs
const sampleSurahList = SURAH_CATALOG.slice(0, 3).map((s) => ({
  number: s.number,
  name: s.name,
  nameLatin: s.nameLatin,
  numberOfAyah: s.numberOfAyah,
  translationName: s.translationIdName,
  revelationType: s.revelationType,
}));

const sampleSurahDetail = {
  number: 1,
  name: SAMPLE_ALFATIHAH.name,
  nameLatin: SAMPLE_ALFATIHAH.name_latin,
  numberOfAyah: 7,
  translationName: SAMPLE_ALFATIHAH.translations.id.name,
  revelationType: "Makkiyah",
  ayahs: Object.keys(SAMPLE_ALFATIHAH.text).map((key) => {
    const idx = key as keyof typeof SAMPLE_ALFATIHAH.text;
    return {
      number: parseInt(key, 10),
      textArabic: SAMPLE_ALFATIHAH.text[idx],
      translationId: SAMPLE_ALFATIHAH.translations.id.text[idx as keyof typeof SAMPLE_ALFATIHAH.translations.id.text],
      tafsirKemenag: "Surah ini dimulai dengan membaca basmalah..."
    };
  })
};

const sampleSearchResult = {
  query: "esa",
  total: 1,
  results: [
    {
      surahNumber: 112,
      surahNameLatin: "Al-Ikhlas",
      ayahNumber: 1,
      textArabic: "قُلْ هُوَ اللّٰهُ أَحَدٌ",
      translationId: "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.\""
    }
  ]
};

/** Registry of available API endpoints */
export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "get-surah-list",
    name: "Get Surah List (Edge)",
    path: API_PATHS.surahList,
    method: "GET",
    description: "Retrieve a list of all 114 surahs from the D1 database. Edge-cached using KV.",
    pathParams: [],
    sampleResponse: { success: true, data: sampleSurahList } as unknown as Record<string, unknown>,
  },
  {
    id: "get-surah-detail",
    name: "Get Surah Detail (Edge)",
    path: API_PATHS.surahDetail("{number}"),
    method: "GET",
    description: "Retrieve detailed surah data (with all ayahs, translations, and Tafsir) from D1. Edge-cached using KV.",
    pathParams: [
      {
        name: "number",
        type: "number",
        required: true,
        description: "Surah number (1-114)",
        defaultValue: "1",
      },
    ],
    sampleResponse: { success: true, data: sampleSurahDetail } as unknown as Record<string, unknown>,
  },
  {
    id: "search-ayahs",
    name: "Search Ayahs (Edge)",
    path: API_PATHS.search("{query}"),
    method: "GET",
    description: "Search ayahs by translation text or surah name using SQL LIKE query on D1.",
    pathParams: [
      {
        name: "query",
        type: "string",
        required: true,
        description: "Search query (at least 2 characters)",
        defaultValue: "esa",
      },
    ],
    sampleResponse: { success: true, data: sampleSearchResult } as unknown as Record<string, unknown>,
  },
];

/** Snippet language display labels */
export const SNIPPET_LANG_LABELS: Record<CodeSnippetLang, string> = {
  curl: "cURL",
  javascript: "JavaScript",
  python: "Python",
  php: "PHP",
};

/** Revelation filters for exploration */
export const REVELATION_FILTERS: RevelationFilter[] = ["All", "Makkiyah", "Madaniyah"];
