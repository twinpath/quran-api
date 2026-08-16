/**
 * Seed script: reads JSON files from data/surah/ and inserts them into D1.
 *
 * Usage (local D1):
 *   npx tsx src/lib/db/seed.ts
 *
 * This script is designed to run in a Node.js environment (not in Workers).
 * It reads the JSON files from disk and outputs SQL INSERT statements
 * that can be piped into `wrangler d1 execute`.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { QuranSurahFile } from "@/types/quran";

/**
 * Revelation type lookup (indexed by surah number, 1-based).
 * Matches the REVELATION_TYPES array in quran-data.ts.
 */
const REVELATION_TYPES: string[] = [
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
 * Escape a string for safe use inside SQL single quotes.
 */
function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Generate SQL INSERT statements from the Quran JSON dataset.
 */
function generateSeedSql(): string {
  const dataDir = path.resolve(__dirname, "../../../data/surah");
  const lines: string[] = [];

  lines.push("-- Auto-generated seed SQL for Quran D1 database");
  lines.push("-- Source: data/surah/*.json");
  lines.push("");
  lines.push("DELETE FROM ayahs;");
  lines.push("DELETE FROM surahs;");
  lines.push("");

  for (let surahNum = 1; surahNum <= 114; surahNum++) {
    const filePath = path.join(dataDir, `${surahNum}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed: QuranSurahFile = JSON.parse(raw);
    const surah = parsed[String(surahNum)];

    if (!surah) {
      console.error(`Missing surah data for number ${surahNum}`);
      continue;
    }

    const numberOfAyah = parseInt(surah.number_of_ayah, 10);
    const translationName = surah.translations?.id?.name ?? "";
    const revelationType = REVELATION_TYPES[surahNum - 1];

    // Insert surah row
    lines.push(
      `INSERT INTO surahs (number, name, name_latin, number_of_ayah, translation_name, revelation_type) VALUES (${surahNum}, '${escapeSql(surah.name)}', '${escapeSql(surah.name_latin)}', ${numberOfAyah}, '${escapeSql(translationName)}', '${escapeSql(revelationType)}');`,
    );

    // Insert ayah rows
    for (let ayahNum = 1; ayahNum <= numberOfAyah; ayahNum++) {
      const ayahKey = String(ayahNum);
      const id = `${surahNum}:${ayahNum}`;
      const textArabic = surah.text[ayahKey] ?? "";
      const translationId = surah.translations?.id?.text?.[ayahKey] ?? "";
      const tafsirKemenag = surah.tafsir?.id?.kemenag?.text?.[ayahKey] ?? null;

      const tafsirValue = tafsirKemenag !== null ? `'${escapeSql(tafsirKemenag)}'` : "NULL";

      lines.push(
        `INSERT INTO ayahs (id, surah_number, ayah_number, text_arabic, translation_id, tafsir_kemenag) VALUES ('${id}', ${surahNum}, ${ayahNum}, '${escapeSql(textArabic)}', '${escapeSql(translationId)}', ${tafsirValue});`,
      );
    }

    lines.push("");
  }

  return lines.join("\n");
}

// Main execution
const sql = generateSeedSql();

const outPath = path.resolve(__dirname, "../../../migrations/seed.sql");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, sql, "utf-8");
console.log(`Seed SQL written to: ${outPath}`);
console.log("Run: wrangler d1 execute quran --local --file=./migrations/seed.sql");
