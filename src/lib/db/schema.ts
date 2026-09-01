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
 * Better Auth User table.
 */
export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
    image: text("image"),
    password: text("password"),
    tier: text("tier").notNull().default("developer"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("idx_user_email").on(table.email)],
);

/**
 * Better Auth Session table.
 */
export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("idx_session_token").on(table.token),
    index("idx_session_user").on(table.userId),
  ],
);

/**
 * Better Auth OAuth & Linked Account table.
 */
export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("idx_account_user").on(table.userId),
    index("idx_account_provider").on(table.providerId),
  ],
);

/**
 * Better Auth Verification token table.
 */
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

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
      .references(() => user.id, { onDelete: "cascade" }),
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
