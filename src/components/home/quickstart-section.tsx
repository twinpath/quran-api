"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/common/code-block";
import { SITE_URL } from "@/lib/constants";
import { API_PATHS } from "@/lib/api-endpoints";

const QUICKSTART_SNIPPETS = {
  php: `<?php
// Get Al-Fatihah (Surah 1)
$response = file_get_contents("${SITE_URL}${API_PATHS.surahDetail(1)}");
$result = json_decode($response, true);
$surah = $result["data"];

echo $surah["nameLatin"] . "\\n"; // "Al-Fatihah"
echo $surah["ayahs"][0]["textArabic"] . "\\n"; // Bismillah...

// Indonesian translation of verse 1
echo $surah["ayahs"][0]["translationId"] . "\\n";

// Tafsir Kemenag of verse 1
echo $surah["ayahs"][0]["tafsirKemenag"] . "\\n";`,
  fetch: `const response = await fetch("${SITE_URL}${API_PATHS.surahDetail(1)}");
const result = await response.json();
const surah = result.data;

console.log(surah.nameLatin);  // "Al-Fatihah"
console.log(surah.ayahs[0].textArabic);   // Bismillah...

// Indonesian translation of verse 1
console.log(surah.ayahs[0].translationId);

// Tafsir Kemenag of verse 1
console.log(surah.ayahs[0].tafsirKemenag);`,
  python: `import requests

response = requests.get("${SITE_URL}${API_PATHS.surahDetail(1)}")
result = response.json()
surah = result["data"]

print(surah["nameLatin"])  # "Al-Fatihah"
print(surah["ayahs"][0]["textArabic"])   # Bismillah...

# Indonesian translation of verse 1
print(surah["ayahs"][0]["translationId"])

# Tafsir Kemenag of verse 1
print(surah["ayahs"][0]["tafsirKemenag"])`,
  curl: `# Get Al-Fatihah (Surah 1)
curl -s "${SITE_URL}${API_PATHS.surahDetail(1)}" | jq '.data.nameLatin'

# Search verses containing "esa"
curl -s "${SITE_URL}${API_PATHS.search("esa")}" | jq '.data.results[0].textArabic'

# Get all 114 Surahs list
curl -s "${SITE_URL}${API_PATHS.surahList}" | jq '.data[0].nameLatin'`,
};

export function QuickstartSection() {
  return (
    <section id="quickstart" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Quickstart</h2>
        <p className="mt-2 text-muted-foreground">
          Get started with Quran JSON in under a minute. Pick your language and copy the snippet.
        </p>
      </div>

      <Tabs defaultValue="php" className="mx-auto max-w-3xl">
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="inline-flex min-w-full justify-start w-max">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="fetch">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
          </TabsList>
        </div>

        {Object.entries(QUICKSTART_SNIPPETS).map(([key, code]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <CodeBlock
              code={code}
              language={key === "fetch" ? "javascript" : key}
              showLineNumbers
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
