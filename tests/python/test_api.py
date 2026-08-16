#!/usr/bin/env python3
# =============================================================================
# Quran Edge API - Python Test Script
# Tests all API endpoints using only the standard library (no pip packages)
# Usage: python test_api.py
# =============================================================================

import json
import os
import sys
import urllib.request
import urllib.error

BASE_URL = os.environ.get("BASE_URL", "https://quran.dyzulk.com")
passed = 0
failed = 0

GREEN = "\033[32m"
RED = "\033[31m"
CYAN = "\033[36m"
BOLD = "\033[1m"
RESET = "\033[0m"


def write_pass(message: str) -> None:
    global passed
    passed += 1
    print(f"  {GREEN}[PASS]{RESET} {message}")


def write_fail(message: str, detail: str = "") -> None:
    global failed
    failed += 1
    print(f"  {RED}[FAIL]{RESET} {message}")
    if detail:
        print(f"        {RED}{detail}{RESET}")


def write_header(message: str) -> None:
    print(f"\n{CYAN}{BOLD}--- {message} ---{RESET}")


def api_get(path: str) -> tuple:
    """Make GET request and return (status_code, parsed_json)."""
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={
        "Accept": "application/json",
        "User-Agent": "QuranEdgeAPI-Test/1.0 (Python)",
    })
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else ""
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            data = None
        return e.code, data


# ---------------------------------------------------------------------------
# Test 1: GET /api/surah (Surah List)
# ---------------------------------------------------------------------------
write_header("Test 1: GET /api/surah (Surah List)")

status, result = api_get("/api/surah")

if status == 200:
    write_pass("HTTP status 200")
else:
    write_fail(f"HTTP status expected 200, got {status}")

if result and result.get("success") is True:
    write_pass("success is True")
else:
    write_fail("success is not True")

data = result.get("data", []) if result else []
if len(data) == 114:
    write_pass("data contains 114 surahs")
else:
    write_fail(f"Expected 114 surahs, got {len(data)}")

if data:
    first = data[0]
    if first.get("nameLatin") == "Al-Fatihah":
        write_pass("First surah is Al-Fatihah")
    else:
        write_fail(f"First surah expected Al-Fatihah, got {first.get('nameLatin')}")

    for field in ["number", "name", "nameLatin", "numberOfAyah", "revelationType"]:
        if field in first:
            write_pass(f"Surah has '{field}' field")
        else:
            write_fail(f"Surah missing '{field}' field")

    last = data[-1]
    if last.get("nameLatin") == "An-Nas":
        write_pass("Last surah is An-Nas")
    else:
        write_fail(f"Last surah expected An-Nas, got {last.get('nameLatin')}")

# ---------------------------------------------------------------------------
# Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)
# ---------------------------------------------------------------------------
write_header("Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)")

status, result = api_get("/api/surah/1")

if status == 200:
    write_pass("HTTP status 200")
else:
    write_fail(f"HTTP status expected 200, got {status}")

if result and result.get("success") is True:
    write_pass("success is True")
else:
    write_fail("success is not True")

data = result.get("data", {}) if result else {}

if data.get("nameLatin") == "Al-Fatihah":
    write_pass("nameLatin is Al-Fatihah")
else:
    write_fail(f"nameLatin expected Al-Fatihah, got {data.get('nameLatin')}")

if data.get("numberOfAyah") == 7:
    write_pass("numberOfAyah is 7")
else:
    write_fail(f"numberOfAyah expected 7, got {data.get('numberOfAyah')}")

ayahs = data.get("ayahs", [])
if len(ayahs) == 7:
    write_pass("ayahs array has 7 elements")
else:
    write_fail(f"ayahs expected 7 elements, got {len(ayahs)}")

if ayahs:
    ayah1 = ayahs[0]
    for field in ["number", "textArabic", "translationId", "tafsirKemenag"]:
        if field in ayah1:
            write_pass(f"Ayah has '{field}' field")
        else:
            write_fail(f"Ayah missing '{field}' field")

    if ayah1.get("number") == 1:
        write_pass("First ayah number is 1")
    else:
        write_fail(f"First ayah number expected 1, got {ayah1.get('number')}")

# ---------------------------------------------------------------------------
# Test 3: GET /api/surah/114 (Surah Detail - An-Nas)
# ---------------------------------------------------------------------------
write_header("Test 3: GET /api/surah/114 (Surah Detail - An-Nas)")

status, result = api_get("/api/surah/114")

if status == 200:
    write_pass("HTTP status 200")
else:
    write_fail(f"HTTP status expected 200, got {status}")

data = result.get("data", {}) if result else {}

if data.get("nameLatin") == "An-Nas":
    write_pass("nameLatin is An-Nas")
else:
    write_fail(f"nameLatin expected An-Nas, got {data.get('nameLatin')}")

if data.get("numberOfAyah") == 6:
    write_pass("numberOfAyah is 6")
else:
    write_fail(f"numberOfAyah expected 6, got {data.get('numberOfAyah')}")

# ---------------------------------------------------------------------------
# Test 4: GET /api/search?q=esa (Search)
# ---------------------------------------------------------------------------
write_header("Test 4: GET /api/search?q=esa (Search)")

status, result = api_get("/api/search?q=esa")

if status == 200:
    write_pass("HTTP status 200")
else:
    write_fail(f"HTTP status expected 200, got {status}")

if result and result.get("success") is True:
    write_pass("success is True")
else:
    write_fail("success is not True")

search_data = result.get("data", {}) if result else {}
total = search_data.get("total", 0)

if total > 0:
    write_pass(f"Search returned {total} results")
else:
    write_fail("Search returned 0 results")

results = search_data.get("results", [])
if results:
    first_result = results[0]
    for field in ["surahNumber", "surahNameLatin", "ayahNumber", "textArabic", "translationId"]:
        if field in first_result:
            write_pass(f"Result has '{field}' field")
        else:
            write_fail(f"Result missing '{field}' field")

# ---------------------------------------------------------------------------
# Test 5: Invalid surah number
# ---------------------------------------------------------------------------
write_header("Test 5: GET /api/surah/999 (Invalid Surah)")

status, _ = api_get("/api/surah/999")

if status != 200:
    write_pass(f"Non-200 status for invalid surah (got {status})")
else:
    write_fail("Expected non-200 for invalid surah, got 200")

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
print()
print("=============================================")
total_tests = passed + failed
print(f"{BOLD}Results: {passed}/{total_tests} passed{RESET}")
if failed > 0:
    print(f"{RED}{BOLD}{failed} test(s) FAILED{RESET}")
    sys.exit(1)
else:
    print(f"{GREEN}{BOLD}All tests PASSED{RESET}")
    sys.exit(0)
