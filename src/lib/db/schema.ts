import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Example table - replace or extend with your actual schema.
 * Drizzle will use this file to generate migrations via `drizzle-kit generate`.
 */
export const surahs = sqliteTable("surahs", {
  number: integer("number").primaryKey(),
  name: text("name").notNull(),
  nameLatin: text("name_latin").notNull(),
  numberOfAyah: integer("number_of_ayah").notNull(),
});
