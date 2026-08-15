import type { SurahSummary, RevelationType } from "@/types/quran";

/**
 * Total ayah counts for all 114 surahs, indexed by surah number (1-based).
 * Sourced from master/generator.sh total_ayah array.
 */
const TOTAL_AYAH: number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52,
  99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34,
  30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26,
  30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

/**
 * Latin transliteration names from master/generator.sh surah_name_latin.
 */
const SURAH_NAME_LATIN: string[] = [
  "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah",
  "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd",
  "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya'",
  "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Asy-Syu'ara'", "An-Naml", "Al-Qasas",
  "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Yasin",
  "As-Saffat", "Sad", "Az-Zumar", "Gafir", "Fussilat", "Asy-Syura", "Az-Zukhruf",
  "Ad-Dukhan", "Al-Jasiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid",
  "Al-Mujadalah", "Al-Hasyr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun",
  "At-Tagabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat",
  "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin",
  "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Gasyiyah", "Al-Fajr", "Al-Balad",
  "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah",
  "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil",
  "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr", "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas",
];

/**
 * Arabic names from master/generator.sh surah_name_arab.
 */
const SURAH_NAME_ARAB: string[] = [
  "الفاتحة", "البقرة", "اٰل عمران", "النساۤء", "الماۤئدة", "الانعام", "الاعراف",
  "الانفال", "التوبة", "يونس", "هود", "يوسف", "الرّعد", "ابرٰهيم", "الحجر", "النحل", "الاسراۤء", "الكهف",
  "مريم", "طٰهٰ", "الانبياۤء", "الحج", "المؤمنون", "النّور", "الفرقان", "الشعراۤء", "النمل", "القصص",
  "العنكبوت", "الرّوم", "لقمٰن", "السّجدة", "الاحزاب", "سبأ", "فاطر", "يٰسۤ", "الصّٰۤفّٰت", "ص",
  "الزمر", "غافر", "فصّلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الاحقاف", "محمّد", "الفتح",
  "الحجرٰت", "ق", "الذّٰريٰت", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة",
  "الحشر", "الممتحنة", "الصّفّ", "الجمعة", "المنٰفقون", "التغابن", "الطلاق", "التحريم", "الملك",
  "القلم", "الحاۤقّة", "المعارج", "نوح", "الجن", "المزّمّل", "المدّثّر", "القيٰمة", "الانسان",
  "المرسلٰت", "النبأ", "النّٰزعٰت", "عبس", "التكوير", "الانفطار", "المطفّفين", "الانشقاق", "البروج",
  "الطارق", "الاعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الّيل", "الضحى", "الشرح", "التين", "العلق",
  "القدر", "البيّنة", "الزلزلة", "العٰديٰت", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش",
  "الماعون", "الكوثر", "الكٰفرون", "النصر", "اللهب", "الاخلاص", "الفلق", "الناس",
];

/**
 * Indonesian translation names from master/generator.sh surah_name_trans_id.
 */
const SURAH_NAME_TRANS_ID: string[] = [
  "Pembukaan", "Sapi", "Keluarga Imran", "Wanita", "Hidangan", "Binatang Ternak",
  "Tempat Tertinggi", "Rampasan Perang", "Pengampunan", "Yunus", "Hud", "Yusuf", "Guruh", "Ibrahim", "Hijr",
  "Lebah", "Memperjalankan Malam Hari", "Goa", "Maryam", "Taha", "Para Nabi", "Haji", "Orang-Orang Mukmin",
  "Cahaya", "Pembeda", "Para Penyair", "Semut-semut", "Kisah-Kisah", "Laba-Laba", "Romawi", "Luqman",
  "Sajdah", "Golongan Yang Bersekutu", "Saba'", "Maha Pencipta", "Yasin", "Barisan-Barisan", "Sad",
  "Rombongan", "Maha Pengampun", "Yang Dijelaskan", "Musyawarah", "Perhiasan", "Kabut", "Berlutut",
  "Bukit Pasir", "Muhammad", "Kemenangan", "Kamar-Kamar", "Qaf", "Angin yang Menerbangkan", "Bukit Tursina",
  "Bintang", "Bulan", "Maha Pengasih", "Hari Kiamat", "Besi", "Gugatan", "Pengusiran", "Wanita Yang Diuji",
  "Barisan", "Jumat", "Orang-Orang Munafik", "Pengungkapan Kesalahan", "Talak", "Pengharaman", "Kerajaan",
  "Pena", "Hari Kiamat", "Tempat Naik", "Nuh", "Jin", "Orang Yang Berselimut", "Orang Yang Berkemul",
  "Hari Kiamat", "Manusia", "Malaikat Yang Diutus", "Berita Besar", "Malaikat Yang Mencabut",
  "Bermuka Masam", "Penggulungan", "Terbelah", "Orang-Orang Curang", "Terbelah", "Gugusan Bintang",
  "Yang Datang Di Malam Hari", "Maha Tinggi", "Hari Kiamat", "Fajar", "Negeri", "Matahari", "Malam",
  "Duha", "Lapang", "Buah Tin", "Segumpal Darah", "Kemuliaan", "Bukti Nyata", "Guncangan",
  "Kuda Yang Berlari Kencang", "Hari Kiamat", "Bermegah-Megahan", "Asar", "Pengumpat", "Gajah",
  "Quraisy", "Barang Yang Berguna", "Pemberian Yang Banyak", "Orang-Orang kafir", "Pertolongan",
  "Api Yang Bergejolak", "Ikhlas", "Subuh", "Manusia",
];

/**
 * Revelation type for each surah (Makkiyah or Madaniyah).
 * Based on traditional Islamic scholarship classification.
 */
const REVELATION_TYPES: RevelationType[] = [
  "Makkiyah", "Madaniyah", "Madaniyah", "Madaniyah", "Madaniyah", "Makkiyah", "Makkiyah",
  "Madaniyah", "Madaniyah", "Makkiyah", "Makkiyah", "Makkiyah", "Madaniyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Madaniyah", "Makkiyah",
  "Madaniyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Madaniyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Madaniyah",
  "Madaniyah", "Madaniyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Madaniyah",
  "Makkiyah", "Madaniyah", "Madaniyah", "Madaniyah", "Madaniyah", "Madaniyah", "Madaniyah", "Madaniyah",
  "Madaniyah", "Madaniyah", "Madaniyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Madaniyah", "Makkiyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah", "Madaniyah", "Madaniyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Makkiyah", "Madaniyah", "Makkiyah", "Makkiyah",
  "Makkiyah", "Makkiyah",
];

/**
 * Build the complete catalog of 114 surahs with metadata.
 */
function buildSurahCatalog(): SurahSummary[] {
  return Array.from({ length: 114 }, (_, i) => ({
    number: i + 1,
    numberString: String(i + 1),
    numberPadded: String(i + 1).padStart(3, "0"),
    name: SURAH_NAME_ARAB[i],
    nameLatin: SURAH_NAME_LATIN[i],
    numberOfAyah: TOTAL_AYAH[i],
    translationIdName: SURAH_NAME_TRANS_ID[i],
    revelationType: REVELATION_TYPES[i],
  }));
}

/** Complete catalog of all 114 surahs */
export const SURAH_CATALOG: SurahSummary[] = buildSurahCatalog();

/**
 * Get a surah summary by number (1-based).
 */
export function getSurahByNumber(num: number): SurahSummary | undefined {
  return SURAH_CATALOG.find((s) => s.number === num);
}

/**
 * Sample ayah data for live preview (from master/surah/1.json - Al-Fatihah).
 */
export const SAMPLE_ALFATIHAH = {
  number: "1",
  name: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
  name_latin: "Al-Fatihah",
  number_of_ayah: "7",
  text: {
    "1": "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u0670\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0652\u0645\u0650",
    "2": "\u0627\u064E\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u0651\u0670\u0647\u0650 \u0631\u064E\u0628\u0651\u0650 \u0627\u0644\u0652\u0639\u0670\u0644\u064E\u0645\u0650\u064A\u0652\u0646\u064E\u0659",
    "3": "\u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0652\u0645\u0650\u0659",
    "4": "\u0645\u0670\u0644\u0650\u0643\u0650 \u064A\u064E\u0648\u0652\u0645\u0650 \u0627\u0644\u062F\u0651\u0650\u064A\u0652\u0646\u0650\u0657",
    "5": "\u0627\u0650\u064A\u0651\u064E\u0627\u0643\u064E \u0646\u064E\u0639\u0652\u0628\u064F\u062F\u064F \u0648\u064E\u0627\u0650\u064A\u0651\u064E\u0627\u0643\u064E \u0646\u064E\u0633\u0652\u062A\u064E\u0639\u0650\u064A\u0652\u0646\u064F\u0657",
    "6": "\u0627\u0650\u0647\u0652\u062F\u0650\u0646\u064E\u0627 \u0627\u0644\u0635\u0651\u0650\u0631\u064E\u0627\u0637\u064E \u0627\u0644\u0652\u0645\u064F\u0633\u0652\u062A\u064E\u0642\u0650\u064A\u0652\u0645\u064E \u0659",
    "7": "\u0635\u0650\u0631\u064E\u0627\u0637\u064E \u0627\u0644\u0651\u064E\u0630\u0650\u064A\u0652\u0646\u064E \u0627\u064E\u0646\u0652\u0639\u064E\u0645\u0652\u062A\u064E \u0639\u064E\u0644\u064E\u064A\u0652\u0647\u0650\u0645\u0652 \u06D9\u0659 \u063A\u064E\u064A\u0652\u0631\u0650 \u0627\u0644\u0652\u0645\u064E\u063A\u0652\u0636\u064F\u0648\u0652\u0628\u0650 \u0639\u064E\u0644\u064E\u064A\u0652\u0647\u0650\u0645\u0652 \u0648\u064E\u0644\u064E\u0627 \u0627\u0644\u0636\u0651\u064E\u0627\u06E4\u0644\u0651\u0650\u064A\u0652\u0646\u064E \u08D6",
  },
  translations: {
    id: {
      name: "Pembukaan",
      text: {
        "1": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        "2": "Segala puji bagi Allah, Tuhan seluruh alam,",
        "3": "Yang Maha Pengasih, Maha Penyayang,",
        "4": "Pemilik hari pembalasan.",
        "5": "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.",
        "6": "Tunjukilah kami jalan yang lurus,",
        "7": "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
      },
    },
  },
};

/** Sample response for Al-Ikhlas (surah 112) */
export const SAMPLE_ALIKHLAS = {
  number: "112",
  name: "\u0627\u0644\u0627\u062E\u0644\u0627\u0635",
  name_latin: "Al-Ikhlas",
  number_of_ayah: "4",
  text: {
    "1": "\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u0651\u0670\u0647\u064F \u0627\u064E\u062D\u064E\u062F\u064C\u06DB",
    "2": "\u0627\u064E\u0644\u0644\u0651\u0670\u0647\u064F \u0627\u0644\u0635\u0651\u064E\u0645\u064E\u062F\u064F\u06DB",
    "3": "\u0644\u064E\u0645\u0652 \u064A\u064E\u0644\u0650\u062F\u0652\u06D6 \u0648\u064E\u0644\u064E\u0645\u0652 \u064A\u064F\u0648\u0652\u0644\u064E\u062F\u0652\u06D6",
    "4": "\u0648\u064E\u0644\u064E\u0645\u0652 \u064A\u064E\u0643\u064F\u0646\u0652 \u0644\u0651\u064E\u0647\u064F \u0643\u064F\u0641\u064F\u0648\u064B\u0627 \u0627\u064E\u062D\u064E\u062F\u064C \u08D6",
  },
  translations: {
    id: {
      name: "Ikhlas",
      text: {
        "1": "Katakanlah (Muhammad), \u201CDia-lah Allah, Yang Maha Esa.",
        "2": "Allah tempat meminta segala sesuatu.",
        "3": "(Allah) tidak beranak dan tidak pula diperanakkan.",
        "4": "Dan tidak ada sesuatu yang setara dengan Dia.\u201D",
      },
    },
  },
};
