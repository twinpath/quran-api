"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/common/code-block";
import { SITE_URL } from "@/lib/constants";

const QUICKSTART_SNIPPETS = {
  php: `<?php
// Get Al-Fatihah (Surah 1)
$response = file_get_contents("${SITE_URL}/surah/1.json");
$data = json_decode($response, true);
$surah = $data["1"];

echo $surah["name_latin"] . "\\n"; // "Al-Fatihah"
echo $surah["text"]["1"] . "\\n"; // Bismillah...

// Indonesian translation
echo $surah["translations"]["id"]["text"]["1"] . "\\n";

// Tafsir Kemenag
echo $surah["tafsir"]["id"]["kemenag"]["text"]["1"] . "\\n";`,
  fetch: `const response = await fetch("${SITE_URL}/surah/1.json");
const data = await response.json();
const surah = data["1"];

console.log(surah.name_latin);  // "Al-Fatihah"
console.log(surah.text["1"]);   // Bismillah...

// Indonesian translation
console.log(surah.translations.id.text["1"]);

// Tafsir Kemenag
console.log(surah.tafsir.id.kemenag.text["1"]);`,
  python: `import requests

response = requests.get("${SITE_URL}/surah/1.json")
data = response.json()
surah = data["1"]

print(surah["name_latin"])  # "Al-Fatihah"
print(surah["text"]["1"])   # Bismillah...

# Indonesian translation
print(surah["translations"]["id"]["text"]["1"])

# Tafsir Kemenag
print(surah["tafsir"]["id"]["kemenag"]["text"]["1"])`,
  curl: `# Get Al-Fatihah (Surah 1)
curl -s ${SITE_URL}/surah/1.json | jq '.["1"].name_latin'

# Get An-Nas (Surah 114) using 3-digit format
curl -s ${SITE_URL}/surah-3digit/114.json | jq '.["114"].text'

# Get all ayahs with translations
curl -s ${SITE_URL}/surah/112.json | jq '.["112"].translations.id.text'`,
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
            <TabsTrigger value="php">PHP</TabsTrigger>
            <TabsTrigger value="fetch">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
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
