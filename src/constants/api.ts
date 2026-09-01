import type { ApiEndpoint, CodeSnippetLang, SurahSortKey, AyahCountRangeKey } from "@/types/api";
import type { RevelationFilter } from "@/hooks/use-surah-search";

/** Centralized API paths for edge-native routes */
export const API_PATHS = {
  // Edge-native dynamic routes (D1 + KV)
  surahList: "/api/surah",
  surahDetail: (num: string | number) => `/api/surah/${num}`,
  surahAyahDetail: (num: string | number, ayahNum: string | number) => `/api/surah/${num}/${ayahNum}`,
  search: (query: string) => `/api/search?q=${query}`,
} as const;

/** Pre-formatted JSON string for the playground preview card on the home page */
export const PLAYGROUND_SAMPLE_RESPONSE = JSON.stringify(
  {
    success: true,
    data: {
      number: 1,
      name: "الفاتحة",
      nameLatin: "Al-Fatihah",
      numberOfAyah: 7,
      translationName: "Pembukaan",
      revelationType: "Makkiyah",
      ayahs: [
        {
          number: 1,
          textArabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
          translationId: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
          tafsirKemenag: "Surah ini dimulai dengan membaca basmalah...",
        },
      ],
    },
    meta: { cached: true, responseTimeMs: 15 },
  },
  null,
  2,
);

/** Registry of available API endpoints */
export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "get-surah-list",
    name: "Get Surah List",
    path: API_PATHS.surahList,
    method: "GET",
    description: "Retrieve a list of all 114 surahs with basic metadata including Arabic names, transliterations, and revelation types.",
    pathParams: [],
    sampleResponse: {
      success: true,
      data: [
        { number: 1, name: "الفاتحة", nameLatin: "Al-Fatihah", numberOfAyah: 7, translationName: "Pembukaan", revelationType: "Makkiyah" },
        { number: 2, name: "البقرة", nameLatin: "Al-Baqarah", numberOfAyah: 286, translationName: "Sapi", revelationType: "Madaniyah" },
        { number: 3, name: "اٰل عمران", nameLatin: "Ali 'Imran", numberOfAyah: 200, translationName: "Keluarga Imran", revelationType: "Madaniyah" },
      ],
      meta: { cached: true, responseTimeMs: 12 },
    } as unknown as Record<string, unknown>,
  },
  {
    id: "get-surah-detail",
    name: "Get Surah Detail",
    path: API_PATHS.surahDetail("{surahNumber}"),
    method: "GET",
    description: "Retrieve complete surah data including all verses (ayahs), Indonesian translations, and Tafsir Kemenag.",
    pathParams: [
      {
        name: "surahNumber",
        type: "number",
        required: true,
        description: "Surah number (1-114)",
        defaultValue: "1",
      },
    ],
    sampleResponse: {
      success: true,
      data: {
        number: 1,
        name: "الفاتحة",
        nameLatin: "Al-Fatihah",
        numberOfAyah: 7,
        translationName: "Pembukaan",
        revelationType: "Makkiyah",
        ayahs: [
          {
            number: 1,
            textArabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
            translationId: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
            tafsirKemenag: "Surah ini dimulai dengan membaca basmalah...",
          },
        ],
      },
      meta: { cached: true, responseTimeMs: 18 },
    } as unknown as Record<string, unknown>,
  },
  {
    id: "get-ayah-detail",
    name: "Get Ayah Detail",
    path: API_PATHS.surahAyahDetail("{surahNumber}", "{ayahNumber}"),
    method: "GET",
    description: "Retrieve a specific verse (ayah) with Arabic text, Indonesian translation, and Tafsir Kemenag.",
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
    sampleResponse: {
      success: true,
      data: {
        surahNumber: 1,
        surahName: "الفاتحة",
        surahNameLatin: "Al-Fatihah",
        number: 1,
        textArabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
        translationId: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        tafsirKemenag: "Surah ini dimulai dengan membaca basmalah...",
      },
      meta: { cached: true, responseTimeMs: 15 },
    } as unknown as Record<string, unknown>,
  },
  {
    id: "search-ayahs",
    name: "Search Ayahs",
    path: API_PATHS.search("{query}"),
    method: "GET",
    description: "Search verses across all surahs by matching translation text or surah name keywords.",
    pathParams: [
      {
        name: "query",
        type: "string",
        required: true,
        description: "Search query (at least 2 characters)",
        defaultValue: "esa",
      },
    ],
    sampleResponse: {
      success: true,
      data: {
        query: "esa",
        total: 1,
        results: [
          {
            surahNumber: 112,
            surahNameLatin: "Al-Ikhlas",
            ayahNumber: 1,
            textArabic: "قُلْ هُوَ اللّٰهُ أَحَدٌ",
            translationId: "Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa.\"",
          },
        ],
      },
      meta: { cached: false, responseTimeMs: 22 },
    } as unknown as Record<string, unknown>,
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
