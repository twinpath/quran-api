CREATE TABLE `ayahs` (
	`id` text PRIMARY KEY NOT NULL,
	`surah_number` integer NOT NULL,
	`ayah_number` integer NOT NULL,
	`text_arabic` text NOT NULL,
	`translation_id` text NOT NULL,
	`tafsir_kemenag` text,
	FOREIGN KEY (`surah_number`) REFERENCES `surahs`(`number`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_ayahs_surah` ON `ayahs` (`surah_number`);--> statement-breakpoint
CREATE TABLE `surahs` (
	`number` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_latin` text NOT NULL,
	`number_of_ayah` integer NOT NULL,
	`translation_name` text NOT NULL,
	`revelation_type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `telemetry_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`endpoint` text NOT NULL,
	`ip_hash` text NOT NULL,
	`status_code` integer NOT NULL,
	`response_time_ms` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_telemetry_created` ON `telemetry_logs` (`created_at`);