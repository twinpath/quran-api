import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

/**
 * Surah metadata table (114 rows).
 * Stores chapter-level information for each surah.
 */
export const surahs = sqliteTable("surahs", {
  number: integer("number").primaryKey(),
  name: text("name").notNull(),
  nameLatin: text("name_latin").notNull(),
  numberOfAyah: integer("number_of_ayah").notNull(),
  translationName: text("translation_name").notNull(),
  revelationType: text("revelation_type").notNull(),
});

/**
 * Ayah (verse) table (~6236 rows).
 * Each row holds the Arabic text, Indonesian translation, and Kemenag tafsir
 * for a single verse. The composite primary key is "surah:ayah" (e.g. "1:1").
 */
export const ayahs = sqliteTable(
  "ayahs",
  {
    id: text("id").primaryKey(),
    surahNumber: integer("surah_number")
      .notNull()
      .references(() => surahs.number),
    ayahNumber: integer("ayah_number").notNull(),
    textArabic: text("text_arabic").notNull(),
    translationId: text("translation_id").notNull(),
    tafsirKemenag: text("tafsir_kemenag"),
  },
  (table) => [index("idx_ayahs_surah").on(table.surahNumber)],
);

/**
 * API telemetry log table.
 * Records each API request for analytics and monitoring purposes.
 */
export const telemetryLogs = sqliteTable(
  "telemetry_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    endpoint: text("endpoint").notNull(),
    ipHash: text("ip_hash").notNull(),
    statusCode: integer("status_code").notNull(),
    responseTimeMs: integer("response_time_ms").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("idx_telemetry_created").on(table.createdAt)],
);
