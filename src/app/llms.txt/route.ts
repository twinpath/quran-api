import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants";

export async function GET() {
  const content = `# ${SITE_NAME}

${SITE_DESCRIPTION}

## Overview

${SITE_NAME} provides a free, open-source Al-Quran REST API with structured JSON responses for Arabic text, Indonesian translations, Tafsir, and surah metadata.

## Primary endpoints

- Home: ${SITE_URL}
- About: ${SITE_URL}/about
- Surah catalog: ${SITE_URL}/surah
- API Playground: ${SITE_URL}/playground
- API status: ${SITE_URL}/status

## Data source

- Source: Kementerian Agama Republik Indonesia
- Original author: Rio Astamal
- License: MIT

## Notes

- API responses are returned as clean JSON.
- Content is optimized for programmatic access and developer tooling.
- The project is open source and available on GitHub.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
