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
      "Yes, completely free with no API keys and no authentication. It is rate limited to 60 requests per minute to ensure stability and prevent abuse. The project is MIT licensed and open source.",
  },
  {
    question: "What is the response format?",
    answer:
      "All responses are returned as clean JSON. The edge routes return structured payloads containing surah metadata and an array of ayahs, each with translation and Tafsir.",
  },
  {
    question: "Can I self-host this?",
    answer:
      "Absolutely. Clone the repository, configure Cloudflare D1 and KV, build with OpenNext, and deploy directly to Cloudflare Workers.",
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
