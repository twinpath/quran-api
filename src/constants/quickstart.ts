import { SITE_URL } from "./site";
import { API_PATHS } from "./api";

export const QUICKSTART_SNIPPETS = {
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
  python: `import urllib.request
import json

url = "${SITE_URL}${API_PATHS.surahDetail(1)}"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

with urllib.request.urlopen(req) as response:
    result = json.loads(response.read().decode("utf-8"))
    surah = result["data"]
    
    print(surah["nameLatin"])  # "Al-Fatihah"
    print(surah["ayahs"][0]["textArabic"])   # Bismillah...
    print(surah["ayahs"][0]["translationId"])
    print(surah["ayahs"][0]["tafsirKemenag"])`,
  curl: `# Get Al-Fatihah (Surah 1)
# With jq (formatted):
curl -s "${SITE_URL}${API_PATHS.surahDetail(1)}" | jq '.data.nameLatin'
# Raw JSON alternative (without jq):
curl -s "${SITE_URL}${API_PATHS.surahDetail(1)}"

# Search verses containing "esa"
curl -s "${SITE_URL}${API_PATHS.search("esa")}"

# Get all 114 Surahs list
curl -s "${SITE_URL}${API_PATHS.surahList}"`,
};
