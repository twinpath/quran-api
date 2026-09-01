/** Supported HTTP methods for API endpoints */
export type ApiMethod = "GET";

/** Supported code snippet languages */
export type CodeSnippetLang = "curl" | "javascript" | "python" | "php";

/** API endpoint definition */
export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: ApiMethod;
  description: string;
  pathParams: ApiParam[];
  sampleResponse: Record<string, unknown>;
}

/** API path parameter */
export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue: string;
}

/** API playground state */
export interface PlaygroundState {
  selectedEndpointId: string;
  paramValues: Record<string, string>;
  response: PlaygroundResponse | null;
  isLoading: boolean;
  activeSnippetLang: CodeSnippetLang;
}

/** API playground response */
export interface PlaygroundResponse {
  status: number;
  statusText: string;
  latencyMs: number;
  data: Record<string, unknown>;
}

/** Standard envelope for all API JSON responses */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ApiResponseMeta;
}

/** Standard error envelope for API error responses */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/** Optional metadata attached to successful API responses */
export interface ApiResponseMeta {
  cached: boolean;
  responseTimeMs: number;
}

/** Shape of a single surah in /api/surah list */
export interface ApiSurahListItem {
  number: number;
  name: string;
  nameLatin: string;
  numberOfAyah: number;
  translationName: string;
  revelationType: string;
}

/** Shape of a single ayah in /api/surah/[number] detail */
export interface ApiAyahItem {
  number: number;
  textArabic: string;
  translationId: string;
  tafsirKemenag: string | null;
}

/** Shape of /api/surah/[number] response data */
export interface ApiSurahDetail {
  number: number;
  name: string;
  nameLatin: string;
  numberOfAyah: number;
  translationName: string;
  revelationType: string;
  ayahs: ApiAyahItem[];
}

/** Shape of /api/surah/[number]/[ayahNumber] response data */
export interface ApiAyahDetail {
  surahNumber: number;
  surahName: string;
  surahNameLatin: string;
  number: number;
  textArabic: string;
  translationId: string;
  tafsirKemenag: string | null;
}

/** Shape of /api/search response data */
export interface ApiSearchResult {
  query: string;
  total: number;
  results: ApiSearchHit[];
}

/** Single search hit */
export interface ApiSearchHit {
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber: number;
  textArabic: string;
  translationId: string;
}

/** Sorting options keys for Surah Explorer */
export type SurahSortKey =
  | "number-asc"
  | "number-desc"
  | "ayahs-asc"
  | "ayahs-desc"
  | "name-asc"
  | "name-desc";

/** Ayah count range filter options */
export type AyahCountRangeKey = "all" | "short" | "medium" | "long";
