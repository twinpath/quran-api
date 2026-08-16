<?php
// =============================================================================
// Quran Edge API - PHP Test Script
// Tests all API endpoints using file_get_contents (no Composer needed)
// Usage: php test-api.php
// =============================================================================

$baseUrl = getenv('BASE_URL') ?: 'https://quran.dyzulk.com';
$pass = 0;
$fail = 0;

function writePass(string $message): void {
    global $pass;
    $pass++;
    echo "  \033[32m[PASS]\033[0m $message\n";
}

function writeFail(string $message, string $detail = ''): void {
    global $fail;
    $fail++;
    echo "  \033[31m[FAIL]\033[0m $message\n";
    if ($detail) {
        echo "        \033[31m$detail\033[0m\n";
    }
}

function writeHeader(string $message): void {
    echo "\n\033[36m\033[1m--- $message ---\033[0m\n";
}

/**
 * Make a GET request and return [status_code, parsed_data].
 * @return array{int, mixed}
 */
function apiGet(string $url): array {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Accept: application/json\r\n",
            'ignore_errors' => true,
            'timeout' => 30,
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    $statusCode = 0;

    if (isset($http_response_header)) {
        foreach ($http_response_header as $header) {
            if (preg_match('/HTTP\/\d+\.?\d*\s+(\d+)/', $header, $matches)) {
                $statusCode = (int) $matches[1];
            }
        }
    }

    $data = ($body !== false) ? json_decode($body, true) : null;
    return [$statusCode, $data];
}

// ---------------------------------------------------------------------------
// Test 1: GET /api/surah (Surah List)
// ---------------------------------------------------------------------------
writeHeader("Test 1: GET /api/surah (Surah List)");

[$status, $result] = apiGet("$baseUrl/api/surah");

if ($status === 200) {
    writePass("HTTP status 200");
} else {
    writeFail("HTTP status expected 200, got $status");
}

if (isset($result['success']) && $result['success'] === true) {
    writePass("success is true");
} else {
    writeFail("success is not true");
}

$data = $result['data'] ?? [];
if (count($data) === 114) {
    writePass("data contains 114 surahs");
} else {
    writeFail("Expected 114 surahs, got " . count($data));
}

if (!empty($data)) {
    $first = $data[0];

    if (($first['nameLatin'] ?? '') === 'Al-Fatihah') {
        writePass("First surah is Al-Fatihah");
    } else {
        writeFail("First surah expected Al-Fatihah, got " . ($first['nameLatin'] ?? 'null'));
    }

    $requiredFields = ['number', 'name', 'nameLatin', 'numberOfAyah', 'revelationType'];
    foreach ($requiredFields as $field) {
        if (array_key_exists($field, $first)) {
            writePass("Surah has '$field' field");
        } else {
            writeFail("Surah missing '$field' field");
        }
    }

    $last = end($data);
    if (($last['nameLatin'] ?? '') === 'An-Nas') {
        writePass("Last surah is An-Nas");
    } else {
        writeFail("Last surah expected An-Nas, got " . ($last['nameLatin'] ?? 'null'));
    }
}

// ---------------------------------------------------------------------------
// Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)
// ---------------------------------------------------------------------------
writeHeader("Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)");

[$status, $result] = apiGet("$baseUrl/api/surah/1");

if ($status === 200) {
    writePass("HTTP status 200");
} else {
    writeFail("HTTP status expected 200, got $status");
}

if (isset($result['success']) && $result['success'] === true) {
    writePass("success is true");
} else {
    writeFail("success is not true");
}

$data = $result['data'] ?? [];

if (($data['nameLatin'] ?? '') === 'Al-Fatihah') {
    writePass("nameLatin is Al-Fatihah");
} else {
    writeFail("nameLatin expected Al-Fatihah, got " . ($data['nameLatin'] ?? 'null'));
}

if (($data['numberOfAyah'] ?? 0) === 7) {
    writePass("numberOfAyah is 7");
} else {
    writeFail("numberOfAyah expected 7, got " . ($data['numberOfAyah'] ?? 'null'));
}

$ayahs = $data['ayahs'] ?? [];
if (count($ayahs) === 7) {
    writePass("ayahs array has 7 elements");
} else {
    writeFail("ayahs expected 7 elements, got " . count($ayahs));
}

if (!empty($ayahs)) {
    $ayah1 = $ayahs[0];

    $ayahFields = ['number', 'textArabic', 'translationId', 'tafsirKemenag'];
    foreach ($ayahFields as $field) {
        if (array_key_exists($field, $ayah1)) {
            writePass("Ayah has '$field' field");
        } else {
            writeFail("Ayah missing '$field' field");
        }
    }

    if (($ayah1['number'] ?? 0) === 1) {
        writePass("First ayah number is 1");
    } else {
        writeFail("First ayah number expected 1, got " . ($ayah1['number'] ?? 'null'));
    }
}

// ---------------------------------------------------------------------------
// Test 3: GET /api/surah/114 (Surah Detail - An-Nas)
// ---------------------------------------------------------------------------
writeHeader("Test 3: GET /api/surah/114 (Surah Detail - An-Nas)");

[$status, $result] = apiGet("$baseUrl/api/surah/114");

if ($status === 200) {
    writePass("HTTP status 200");
} else {
    writeFail("HTTP status expected 200, got $status");
}

$data = $result['data'] ?? [];

if (($data['nameLatin'] ?? '') === 'An-Nas') {
    writePass("nameLatin is An-Nas");
} else {
    writeFail("nameLatin expected An-Nas, got " . ($data['nameLatin'] ?? 'null'));
}

if (($data['numberOfAyah'] ?? 0) === 6) {
    writePass("numberOfAyah is 6");
} else {
    writeFail("numberOfAyah expected 6, got " . ($data['numberOfAyah'] ?? 'null'));
}

// ---------------------------------------------------------------------------
// Test 4: GET /api/search?q=esa (Search)
// ---------------------------------------------------------------------------
writeHeader("Test 4: GET /api/search?q=esa (Search)");

[$status, $result] = apiGet("$baseUrl/api/search?q=esa");

if ($status === 200) {
    writePass("HTTP status 200");
} else {
    writeFail("HTTP status expected 200, got $status");
}

if (isset($result['success']) && $result['success'] === true) {
    writePass("success is true");
} else {
    writeFail("success is not true");
}

$searchData = $result['data'] ?? [];
$total = $searchData['total'] ?? 0;

if ($total > 0) {
    writePass("Search returned $total results");
} else {
    writeFail("Search returned 0 results");
}

$results = $searchData['results'] ?? [];
if (!empty($results)) {
    $firstResult = $results[0];
    $searchFields = ['surahNumber', 'surahNameLatin', 'ayahNumber', 'textArabic', 'translationId'];
    foreach ($searchFields as $field) {
        if (array_key_exists($field, $firstResult)) {
            writePass("Result has '$field' field");
        } else {
            writeFail("Result missing '$field' field");
        }
    }
}

// ---------------------------------------------------------------------------
// Test 5: Invalid surah number
// ---------------------------------------------------------------------------
writeHeader("Test 5: GET /api/surah/999 (Invalid Surah)");

[$status, ] = apiGet("$baseUrl/api/surah/999");

if ($status !== 200) {
    writePass("Non-200 status for invalid surah (got $status)");
} else {
    writeFail("Expected non-200 for invalid surah, got 200");
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
echo "\n";
echo "=============================================\n";
$total = $pass + $fail;
echo "\033[1mResults: $pass/$total passed\033[0m\n";
if ($fail > 0) {
    echo "\033[31m\033[1m$fail test(s) FAILED\033[0m\n";
    exit(1);
} else {
    echo "\033[32m\033[1mAll tests PASSED\033[0m\n";
    exit(0);
}
