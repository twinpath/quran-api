// =============================================================================
// Quran Edge API - JavaScript Test Script
// Tests all API endpoints using Node.js native fetch (Node 18+)
// Usage: node test-api.mjs
// =============================================================================

const BASE_URL = process.env.BASE_URL || "https://quran.dyzulk.com";
let pass = 0;
let fail = 0;

function writePass(message) {
  pass++;
  console.log(`  \x1b[32m[PASS]\x1b[0m ${message}`);
}

function writeFail(message, detail = "") {
  fail++;
  console.log(`  \x1b[31m[FAIL]\x1b[0m ${message}`);
  if (detail) {
    console.log(`        \x1b[31m${detail}\x1b[0m`);
  }
}

function writeHeader(message) {
  console.log("");
  console.log(`\x1b[36m\x1b[1m--- ${message} ---\x1b[0m`);
}

// ---------------------------------------------------------------------------
// Test 1: GET /api/surah (Surah List)
// ---------------------------------------------------------------------------
writeHeader("Test 1: GET /api/surah (Surah List)");

try {
  const res = await fetch(`${BASE_URL}/api/surah`);

  if (res.status === 200) {
    writePass("HTTP status 200");
  } else {
    writeFail(`HTTP status expected 200, got ${res.status}`);
  }

  const result = await res.json();

  if (result.success === true) {
    writePass("success is true");
  } else {
    writeFail("success is not true");
  }

  if (Array.isArray(result.data) && result.data.length === 114) {
    writePass("data contains 114 surahs");
  } else {
    writeFail(`Expected 114 surahs, got ${result.data?.length}`);
  }

  const first = result.data[0];
  if (first.nameLatin === "Al-Fatihah") {
    writePass("First surah is Al-Fatihah");
  } else {
    writeFail(`First surah expected Al-Fatihah, got ${first.nameLatin}`);
  }

  const requiredFields = ["number", "name", "nameLatin", "numberOfAyah", "revelationType"];
  for (const field of requiredFields) {
    if (field in first) {
      writePass(`Surah has '${field}' field`);
    } else {
      writeFail(`Surah missing '${field}' field`);
    }
  }

  const last = result.data[result.data.length - 1];
  if (last.nameLatin === "An-Nas") {
    writePass("Last surah is An-Nas");
  } else {
    writeFail(`Last surah expected An-Nas, got ${last.nameLatin}`);
  }
} catch (err) {
  writeFail("Request failed", err.message);
}

// ---------------------------------------------------------------------------
// Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)
// ---------------------------------------------------------------------------
writeHeader("Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)");

try {
  const res = await fetch(`${BASE_URL}/api/surah/1`);

  if (res.status === 200) {
    writePass("HTTP status 200");
  } else {
    writeFail(`HTTP status expected 200, got ${res.status}`);
  }

  const result = await res.json();
  const data = result.data;

  if (result.success === true) {
    writePass("success is true");
  } else {
    writeFail("success is not true");
  }

  if (data.nameLatin === "Al-Fatihah") {
    writePass("nameLatin is Al-Fatihah");
  } else {
    writeFail(`nameLatin expected Al-Fatihah, got ${data.nameLatin}`);
  }

  if (data.numberOfAyah === 7) {
    writePass("numberOfAyah is 7");
  } else {
    writeFail(`numberOfAyah expected 7, got ${data.numberOfAyah}`);
  }

  if (Array.isArray(data.ayahs) && data.ayahs.length === 7) {
    writePass("ayahs array has 7 elements");
  } else {
    writeFail(`ayahs expected 7 elements, got ${data.ayahs?.length}`);
  }

  const ayah1 = data.ayahs[0];
  const ayahFields = ["number", "textArabic", "translationId", "tafsirKemenag"];
  for (const field of ayahFields) {
    if (field in ayah1) {
      writePass(`Ayah has '${field}' field`);
    } else {
      writeFail(`Ayah missing '${field}' field`);
    }
  }

  if (ayah1.number === 1) {
    writePass("First ayah number is 1");
  } else {
    writeFail(`First ayah number expected 1, got ${ayah1.number}`);
  }
} catch (err) {
  writeFail("Request failed", err.message);
}

// ---------------------------------------------------------------------------
// Test 3: GET /api/surah/114 (Surah Detail - An-Nas)
// ---------------------------------------------------------------------------
writeHeader("Test 3: GET /api/surah/114 (Surah Detail - An-Nas)");

try {
  const res = await fetch(`${BASE_URL}/api/surah/114`);
  const result = await res.json();

  if (res.status === 200) {
    writePass("HTTP status 200");
  } else {
    writeFail(`HTTP status expected 200, got ${res.status}`);
  }

  if (result.data.nameLatin === "An-Nas") {
    writePass("nameLatin is An-Nas");
  } else {
    writeFail(`nameLatin expected An-Nas, got ${result.data.nameLatin}`);
  }

  if (result.data.numberOfAyah === 6) {
    writePass("numberOfAyah is 6");
  } else {
    writeFail(`numberOfAyah expected 6, got ${result.data.numberOfAyah}`);
  }
} catch (err) {
  writeFail("Request failed", err.message);
}

// ---------------------------------------------------------------------------
// Test 4: GET /api/search?q=esa (Search)
// ---------------------------------------------------------------------------
writeHeader("Test 4: GET /api/search?q=esa (Search)");

try {
  const res = await fetch(`${BASE_URL}/api/search?q=esa`);
  const result = await res.json();

  if (res.status === 200) {
    writePass("HTTP status 200");
  } else {
    writeFail(`HTTP status expected 200, got ${res.status}`);
  }

  if (result.success === true) {
    writePass("success is true");
  } else {
    writeFail("success is not true");
  }

  if (result.data.total > 0) {
    writePass(`Search returned ${result.data.total} results`);
  } else {
    writeFail("Search returned 0 results");
  }

  const firstResult = result.data.results[0];
  const searchFields = ["surahNumber", "surahNameLatin", "ayahNumber", "textArabic", "translationId"];
  for (const field of searchFields) {
    if (field in firstResult) {
      writePass(`Result has '${field}' field`);
    } else {
      writeFail(`Result missing '${field}' field`);
    }
  }
} catch (err) {
  writeFail("Request failed", err.message);
}

// ---------------------------------------------------------------------------
// Test 5: Invalid surah number
// ---------------------------------------------------------------------------
writeHeader("Test 5: GET /api/surah/999 (Invalid Surah)");

try {
  const res = await fetch(`${BASE_URL}/api/surah/999`);

  if (res.status !== 200) {
    writePass(`Non-200 status for invalid surah (got ${res.status})`);
  } else {
    writeFail("Expected non-200 for invalid surah, got 200");
  }
} catch (err) {
  writeFail("Request failed", err.message);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("");
console.log("=============================================");
const total = pass + fail;
console.log(`Results: ${pass}/${total} passed`);
if (fail > 0) {
  console.log(`\x1b[31m\x1b[1m${fail} test(s) FAILED\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32m\x1b[1mAll tests PASSED\x1b[0m`);
  process.exit(0);
}
