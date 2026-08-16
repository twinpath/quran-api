import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("SEO constants are declared in the shared site metadata module", () => {
  const siteSource = read("src/constants/site.ts");
  const seoSource = read("src/lib/seo.ts");

  assert.match(siteSource, /SITE_OPEN_GRAPH/i);
  assert.match(siteSource, /SITE_TWITTER/i);
  assert.match(siteSource, /SITE_ORGANIZATION_SCHEMA/i);
  assert.match(seoSource, /buildPageMetadata/i);
});

test("SEO routes are available for sitemap, robots, and llms", () => {
  assert.ok(fs.existsSync(path.join(root, "src/app/sitemap.ts")));
  assert.ok(fs.existsSync(path.join(root, "src/app/robots.ts")));
  assert.ok(fs.existsSync(path.join(root, "src/app/llms.txt/route.ts")));
});
