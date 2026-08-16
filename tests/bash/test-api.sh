#!/usr/bin/env bash
# =============================================================================
# Quran Edge API - Bash Test Script
# Tests all API endpoints using curl (no jq required)
# =============================================================================

set -euo pipefail

BASE_URL="${BASE_URL:-https://quran.dyzulk.com}"
PASS=0
FAIL=0

# Colors (disabled if not a terminal)
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  RED='\033[0;31m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  GREEN='' RED='' CYAN='' BOLD='' RESET=''
fi

pass() {
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}[PASS]${RESET} $1"
}

fail() {
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}[FAIL]${RESET} $1"
  if [ -n "${2:-}" ]; then
    echo -e "        ${RED}$2${RESET}"
  fi
}

header() {
  echo ""
  echo -e "${CYAN}${BOLD}--- $1 ---${RESET}"
}

# ---------------------------------------------------------------------------
# Test 1: GET /api/surah (Surah List)
# ---------------------------------------------------------------------------
header "Test 1: GET /api/surah (Surah List)"

RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/surah")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  pass "HTTP status 200"
else
  fail "HTTP status expected 200, got ${HTTP_CODE}"
fi

if echo "$BODY" | grep -q '"success":true'; then
  pass "Response contains success:true"
else
  fail "Response missing success:true"
fi

if echo "$BODY" | grep -q '"nameLatin"'; then
  pass "Response contains nameLatin field"
else
  fail "Response missing nameLatin field"
fi

if echo "$BODY" | grep -q '"Al-Fatihah"'; then
  pass "First surah is Al-Fatihah"
else
  fail "First surah Al-Fatihah not found"
fi

if echo "$BODY" | grep -q '"An-Nas"'; then
  pass "Last surah An-Nas present"
else
  fail "Last surah An-Nas not found"
fi

# ---------------------------------------------------------------------------
# Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)
# ---------------------------------------------------------------------------
header "Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)"

RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/surah/1")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  pass "HTTP status 200"
else
  fail "HTTP status expected 200, got ${HTTP_CODE}"
fi

if echo "$BODY" | grep -q '"success":true'; then
  pass "Response contains success:true"
else
  fail "Response missing success:true"
fi

if echo "$BODY" | grep -q '"nameLatin":"Al-Fatihah"'; then
  pass "nameLatin is Al-Fatihah"
else
  fail "nameLatin Al-Fatihah not found"
fi

if echo "$BODY" | grep -q '"numberOfAyah":7'; then
  pass "numberOfAyah is 7"
else
  fail "numberOfAyah 7 not found"
fi

if echo "$BODY" | grep -q '"textArabic"'; then
  pass "Response contains textArabic field"
else
  fail "Response missing textArabic field"
fi

if echo "$BODY" | grep -q '"translationId"'; then
  pass "Response contains translationId field"
else
  fail "Response missing translationId field"
fi

if echo "$BODY" | grep -q '"tafsirKemenag"'; then
  pass "Response contains tafsirKemenag field"
else
  fail "Response missing tafsirKemenag field"
fi

# ---------------------------------------------------------------------------
# Test 3: GET /api/surah/114 (Surah Detail - An-Nas)
# ---------------------------------------------------------------------------
header "Test 3: GET /api/surah/114 (Surah Detail - An-Nas)"

RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/surah/114")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  pass "HTTP status 200"
else
  fail "HTTP status expected 200, got ${HTTP_CODE}"
fi

if echo "$BODY" | grep -q '"nameLatin":"An-Nas"'; then
  pass "nameLatin is An-Nas"
else
  fail "nameLatin An-Nas not found"
fi

# ---------------------------------------------------------------------------
# Test 4: GET /api/search?q=esa (Search)
# ---------------------------------------------------------------------------
header "Test 4: GET /api/search?q=esa (Search)"

RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/search?q=esa")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  pass "HTTP status 200"
else
  fail "HTTP status expected 200, got ${HTTP_CODE}"
fi

if echo "$BODY" | grep -q '"success":true'; then
  pass "Response contains success:true"
else
  fail "Response missing success:true"
fi

if echo "$BODY" | grep -q '"surahNameLatin"'; then
  pass "Response contains surahNameLatin field"
else
  fail "Response missing surahNameLatin field"
fi

if echo "$BODY" | grep -q '"textArabic"'; then
  pass "Search results contain textArabic"
else
  fail "Search results missing textArabic"
fi

if echo "$BODY" | grep -q '"translationId"'; then
  pass "Search results contain translationId"
else
  fail "Search results missing translationId"
fi

# ---------------------------------------------------------------------------
# Test 5: Invalid surah number
# ---------------------------------------------------------------------------
header "Test 5: GET /api/surah/999 (Invalid Surah)"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/surah/999")

if [ "$HTTP_CODE" != "200" ]; then
  pass "Non-200 status for invalid surah (got ${HTTP_CODE})"
else
  fail "Expected non-200 for invalid surah, got 200"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo ""
echo -e "${BOLD}=============================================${RESET}"
TOTAL=$((PASS + FAIL))
echo -e "${BOLD}Results: ${PASS}/${TOTAL} passed${RESET}"
if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}${BOLD}${FAIL} test(s) FAILED${RESET}"
  exit 1
else
  echo -e "${GREEN}${BOLD}All tests PASSED${RESET}"
  exit 0
fi
