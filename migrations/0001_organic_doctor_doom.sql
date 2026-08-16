ALTER TABLE `telemetry_logs` ADD `country` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `region` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `city` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `latitude` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `longitude` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `device_type` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `os_type` text;--> statement-breakpoint
ALTER TABLE `telemetry_logs` ADD `browser_type` text;--> statement-breakpoint
CREATE INDEX `idx_telemetry_country` ON `telemetry_logs` (`country`);