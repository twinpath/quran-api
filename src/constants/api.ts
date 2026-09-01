import type { ApiEndpoint, CodeSnippetLang, SurahSortKey, AyahCountRangeKey } from "@/types/api";
import { SAMPLE_ALFATIHAH, SURAH_CATALOG } from "@/lib/quran-data";
import type { RevelationFilter } from "@/hooks/use-surah-search";

/** Centralized API paths for edge-native routes */
export const API_PATHS = {
  // Edge-native dynamic routes (D1 + KV)
  surahList: "/api/surah",
  surahDetail: (num: string | number) => `/api/surah/${num}`,
  surahAyahDetail: (num: string | number, ayahNum: string | number) => `/api/surah/${num}/${ayahNum}`,
  search: (query: string) => `/api/search?q=${query}`,
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

const sampleAyahDetail = {
  surahNumber: 1,
  surahName: SAMPLE_ALFATIHAH.name,
  surahNameLatin: SAMPLE_ALFATIHAH.name_latin,
  number: 1,
  textArabic: SAMPLE_ALFATIHAH.text["1"],
  translationId: SAMPLE_ALFATIHAH.translations.id.text["1"],
  tafsirKemenag: "Surah ini dimulai dengan membaca basmalah...",
};

/** Pre-formatted JSON string for the playground preview card on the home page */
export const PLAYGROUND_SAMPLE_RESPONSE = JSON.stringify(
  {
    success: true,
    data: {
      ...sampleSurahDetail,
      ayahs: sampleSurahDetail.ayahs.slice(0, 1),
    },
    meta: { cached: true, responseTimeMs: 15 },
  },
  null,
  2,
);

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
    name: "Get Surah List",
    path: API_PATHS.surahList,
    method: "GET",
    description: "Retrieve a list of all 114 surahs from the D1 database. Edge-cached using KV.",
    pathParams: [],
    sampleResponse: { success: true, data: sampleSurahList } as unknown as Record<string, unknown>,
  },
  {
    id: "get-surah-detail",
    name: "Get Surah Detail",
    path: API_PATHS.surahDetail("{surahNumber}"),
    method: "GET",
    description: "Retrieve detailed surah data (with all ayahs, translations, and Tafsir) from D1. Edge-cached using KV.",
    pathParams: [
      {
        name: "surahNumber",
        type: "number",
        required: true,
        description: "Surah number (1-114)",
        defaultValue: "1",
      },
    ],
    sampleResponse: { success: true, data: sampleSurahDetail } as unknown as Record<string, unknown>,
  },
  {
    id: "get-ayah-detail",
    name: "Get Ayah Detail",
    path: API_PATHS.surahAyahDetail("{surahNumber}", "{ayahNumber}"),
    method: "GET",
    description: "Retrieve a specific verse (ayah) with Arabic text, translation, and Tafsir from D1. Edge-cached using KV.",
    pathParams: [
      {
        name: "surahNumber",
        type: "number",
        required: true,
        description: "Surah number (1-114)",
        defaultValue: "1",
      },
      {
        name: "ayahNumber",
        type: "number",
        required: true,
        description: "Ayah number within the surah",
        defaultValue: "1",
      },
    ],
    sampleResponse: { success: true, data: sampleAyahDetail } as unknown as Record<string, unknown>,
  },
  {
    id: "search-ayahs",
    name: "Search Ayahs",
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

/** Sorting options keys for Surah Explorer */
export const SURAH_SORT_OPTIONS: { value: SurahSortKey; label: string }[] = [
  { value: "number-asc", label: "Surah Number (Asc)" },
  { value: "number-desc", label: "Surah Number (Desc)" },
  { value: "ayahs-asc", label: "Ayah Count (Min)" },
  { value: "ayahs-desc", label: "Ayah Count (Max)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

/** Ayah count range filters */
export const AYAH_COUNT_FILTERS: { value: AyahCountRangeKey; label: string; min?: number; max?: number }[] = [
  { value: "all", label: "Any Length" },
  { value: "short", label: "Short (< 50 ayahs)", max: 49 },
  { value: "medium", label: "Medium (50 - 100 ayahs)", min: 50, max: 100 },
  { value: "long", label: "Long (> 100 ayahs)", min: 101 },
];
