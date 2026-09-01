import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DEV_VARS_PATH = resolve(process.cwd(), ".dev.vars");
const EXAMPLE_PATH = resolve(process.cwd(), ".dev.vars.example");

/**
 * Generates a cryptographically secure base64 string for BETTER_AUTH_SECRET.
 */
function generateSecret(): string {
  return Buffer.from(randomBytes(32)).toString("base64");
}

/**
 * Parses a .env-style file into a key-value record.
 */
function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    result[key] = value;
  }
  return result;
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");

  // Check if .dev.vars already exists
  if (existsSync(DEV_VARS_PATH) && !force) {
    console.error(
      "[generate:vars] .dev.vars already exists.\n" +
        "  Use --force to overwrite: pnpm run generate:vars -- --force"
    );
    process.exit(1);
  }

  // Read the example file as the template
  if (!existsSync(EXAMPLE_PATH)) {
    console.error(
      "[generate:vars] .dev.vars.example not found. Cannot generate .dev.vars without a template."
    );
    process.exit(1);
  }

  const exampleContent = readFileSync(EXAMPLE_PATH, "utf-8");
  const vars = parseEnvFile(exampleContent);

  // Generate a cryptographically secure BETTER_AUTH_SECRET
  const secret = generateSecret();
  vars["BETTER_AUTH_SECRET"] = secret;

  // Ensure default URLs are set
  vars["BETTER_AUTH_URL"] = vars["BETTER_AUTH_URL"] || "http://localhost:3000";
  vars["NEXT_PUBLIC_APP_URL"] =
    vars["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000";
  vars["NEXTJS_ENV"] = vars["NEXTJS_ENV"] || "development";

  // Build the output content
  const output = Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  writeFileSync(DEV_VARS_PATH, output + "\n", "utf-8");

  console.log("[generate:vars] .dev.vars generated successfully.");
  console.log("");
  console.log("  BETTER_AUTH_SECRET = (auto-generated, 32 bytes base64)");
  console.log(`  BETTER_AUTH_URL    = ${vars["BETTER_AUTH_URL"]}`);
  console.log(`  NEXT_PUBLIC_APP_URL = ${vars["NEXT_PUBLIC_APP_URL"]}`);
  console.log(`  GOOGLE_CLIENT_ID   = ${vars["GOOGLE_CLIENT_ID"]}`);
  console.log(`  GOOGLE_CLIENT_SECRET = ${vars["GOOGLE_CLIENT_SECRET"]}`);
  console.log("");
  console.log(
    "  Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with your actual credentials."
  );
}

main();
