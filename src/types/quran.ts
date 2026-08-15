/** Schema for a single surah JSON file from master/surah/{number}.json */
export interface SurahDetail {
  number: string;
  name: string;
  name_latin: string;
  number_of_ayah: string;
  text: Record<string, string>;
  translations: {
    id: {
      name: string;
      text: Record<string, string>;
    };
  };
  tafsir: {
    id: {
      kemenag: {
        name: string;
        source: string;
        text: Record<string, string>;
      };
    };
  };
}

/** Root shape of a surah JSON file, keyed by surah number as string */
export type QuranSurahFile = Record<string, SurahDetail>;

/** Revelation type classification */
export type RevelationType = "Makkiyah" | "Madaniyah";

/** Lightweight surah summary for catalog listings */
export interface SurahSummary {
  number: number;
  numberString: string;
  numberPadded: string;
  name: string;
  nameLatin: string;
  numberOfAyah: number;
  translationIdName: string;
  revelationType: RevelationType;
}

/** Single ayah item for display */
export interface AyahItem {
  number: number;
  text: string;
  translation: string;
  tafsir?: string;
}
