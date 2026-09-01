CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`issuer` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_account_user` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_account_provider` ON `account` (`provider_id`);--> statement-breakpoint
CREATE TABLE `api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`key_prefix` text NOT NULL,
	`key_hash` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`rate_limit` integer DEFAULT 5000 NOT NULL,
	`last_used_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_key_hash_unique` ON `api_keys` (`key_hash`);--> statement-breakpoint
CREATE INDEX `idx_api_keys_hash` ON `api_keys` (`key_hash`);--> statement-breakpoint
CREATE INDEX `idx_api_keys_user` ON `api_keys` (`user_id`);--> statement-breakpoint
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
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `idx_session_token` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `idx_session_user` ON `session` (`user_id`);--> statement-breakpoint
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
	`country` text,
	`region` text,
	`city` text,
	`latitude` text,
	`longitude` text,
	`user_agent` text,
	`device_type` text,
	`os_type` text,
	`browser_type` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_telemetry_created` ON `telemetry_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_telemetry_country` ON `telemetry_logs` (`country`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`password` text,
	`tier` text DEFAULT 'developer' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
