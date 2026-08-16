import type { FaqItem } from "@/types/navigation";

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
