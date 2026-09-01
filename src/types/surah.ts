import type { ApiSurahListItem, SurahSortKey, AyahCountRangeKey } from "./api";

/** Props for main Surah Catalog Client component */
export interface SurahCatalogClientProps {
  initialSurahs: ApiSurahListItem[];
  isLoading?: boolean;
}

/** Props for Surah Catalog Filters sub-component */
export interface SurahCatalogFiltersProps {
  isLoading: boolean;
  surahs: ApiSurahListItem[];
  query: string;
  onQueryChange: (q: string) => void;
  revelationFilter: string;
  onRevelationFilterChange: (v: string) => void;
  sortKey: SurahSortKey;
  onSortKeyChange: (v: SurahSortKey) => void;
  ayahRange: AyahCountRangeKey;
  onAyahRangeChange: (v: AyahCountRangeKey) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  comboboxValue: string;
  onSurahSelect: (numberVal: string) => void;
}

/** Props for Surah Grid sub-component */
export interface SurahGridProps {
  isLoading: boolean;
  filteredSurahs: ApiSurahListItem[];
  totalCount: number;
  isFiltered: boolean;
  onResetFilters: () => void;
  onRetryFetch: () => void;
}
