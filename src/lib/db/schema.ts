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
    country: text("country"),
    region: text("region"),
    city: text("city"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    userAgent: text("user_agent"),
    deviceType: text("device_type"),
    osType: text("os_type"),
    browserType: text("browser_type"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("idx_telemetry_created").on(table.createdAt),
    index("idx_telemetry_country").on(table.country),
  ],
);

/**
 * User accounts table.
 * Stores core user profile, password hash, and OAuth linking status.
 */
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    emailVerifiedAt: integer("email_verified_at", { mode: "timestamp" }),
    googleId: text("google_id"),
    googleEmail: text("google_email"),
    avatarUrl: text("avatar_url"),
    tier: text("tier").notNull().default("developer"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("idx_users_email").on(table.email)],
);

/**
 * Authentication sessions table.
 * Tracks user sessions for session-based authentication.
 */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("idx_sessions_token").on(table.token),
    index("idx_sessions_user").on(table.userId),
  ],
);

/**
 * User API Keys table.
 * Stores SHA-256 hashed API Keys for authenticated developer access.
 */
export const apiKeys = sqliteTable(
  "api_keys",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    keyPrefix: text("key_prefix").notNull(),
    keyHash: text("key_hash").notNull().unique(),
    status: text("status").notNull().default("active"),
    rateLimit: integer("rate_limit").notNull().default(5000),
    lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("idx_api_keys_hash").on(table.keyHash),
    index("idx_api_keys_user").on(table.userId),
  ],
);

