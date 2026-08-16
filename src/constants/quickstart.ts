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
