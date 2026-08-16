# =============================================================================
# Quran Edge API - PowerShell Test Script
# Tests all API endpoints using Invoke-RestMethod (no external tools needed)
# =============================================================================

[CmdletBinding()]
param(
    [string]$BaseUrl = "https://quran.dyzulk.com"
)

$ErrorActionPreference = "Stop"
$Pass = 0
$Fail = 0

function Write-Pass($Message) {
    $script:Pass++
    Write-Host "  [PASS] $Message" -ForegroundColor Green
}

function Write-Fail($Message, $Detail = "") {
    $script:Fail++
    Write-Host "  [FAIL] $Message" -ForegroundColor Red
    if ($Detail) {
        Write-Host "        $Detail" -ForegroundColor Red
    }
}

function Write-Header($Message) {
    Write-Host ""
    Write-Host "--- $Message ---" -ForegroundColor Cyan
}

# ---------------------------------------------------------------------------
# Test 1: GET /api/surah (Surah List)
# ---------------------------------------------------------------------------
Write-Header "Test 1: GET /api/surah (Surah List)"

try {
    $result = Invoke-RestMethod -Uri "$BaseUrl/api/surah" -Method Get
    Write-Pass "HTTP request succeeded"

    if ($result.success -eq $true) {
        Write-Pass "success is true"
    } else {
        Write-Fail "success is not true"
    }

    if ($result.data.Count -eq 114) {
        Write-Pass "data contains 114 surahs"
    } else {
        Write-Fail "Expected 114 surahs, got $($result.data.Count)"
    }

    $first = $result.data[0]
    if ($first.nameLatin -eq "Al-Fatihah") {
        Write-Pass "First surah is Al-Fatihah"
    } else {
        Write-Fail "First surah expected Al-Fatihah, got $($first.nameLatin)"
    }

    if ($first.PSObject.Properties.Name -contains "number") {
        Write-Pass "Surah has 'number' field"
    } else {
        Write-Fail "Surah missing 'number' field"
    }

    if ($first.PSObject.Properties.Name -contains "numberOfAyah") {
        Write-Pass "Surah has 'numberOfAyah' field"
    } else {
        Write-Fail "Surah missing 'numberOfAyah' field"
    }

    if ($first.PSObject.Properties.Name -contains "revelationType") {
        Write-Pass "Surah has 'revelationType' field"
    } else {
        Write-Fail "Surah missing 'revelationType' field"
    }

    $last = $result.data[-1]
    if ($last.nameLatin -eq "An-Nas") {
        Write-Pass "Last surah is An-Nas"
    } else {
        Write-Fail "Last surah expected An-Nas, got $($last.nameLatin)"
    }
} catch {
    Write-Fail "Request failed" $_.Exception.Message
}

# ---------------------------------------------------------------------------
# Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)
# ---------------------------------------------------------------------------
Write-Header "Test 2: GET /api/surah/1 (Surah Detail - Al-Fatihah)"

try {
    $result = Invoke-RestMethod -Uri "$BaseUrl/api/surah/1" -Method Get
    Write-Pass "HTTP request succeeded"

    if ($result.success -eq $true) {
        Write-Pass "success is true"
    } else {
        Write-Fail "success is not true"
    }

    $data = $result.data
    if ($data.nameLatin -eq "Al-Fatihah") {
        Write-Pass "nameLatin is Al-Fatihah"
    } else {
        Write-Fail "nameLatin expected Al-Fatihah, got $($data.nameLatin)"
    }

    if ($data.numberOfAyah -eq 7) {
        Write-Pass "numberOfAyah is 7"
    } else {
        Write-Fail "numberOfAyah expected 7, got $($data.numberOfAyah)"
    }

    if ($data.ayahs.Count -eq 7) {
        Write-Pass "ayahs array has 7 elements"
    } else {
        Write-Fail "ayahs expected 7 elements, got $($data.ayahs.Count)"
    }

    $ayah1 = $data.ayahs[0]
    if ($ayah1.PSObject.Properties.Name -contains "textArabic") {
        Write-Pass "Ayah has 'textArabic' field"
    } else {
        Write-Fail "Ayah missing 'textArabic' field"
    }

    if ($ayah1.PSObject.Properties.Name -contains "translationId") {
        Write-Pass "Ayah has 'translationId' field"
    } else {
        Write-Fail "Ayah missing 'translationId' field"
    }

    if ($ayah1.PSObject.Properties.Name -contains "tafsirKemenag") {
        Write-Pass "Ayah has 'tafsirKemenag' field"
    } else {
        Write-Fail "Ayah missing 'tafsirKemenag' field"
    }

    if ($ayah1.number -eq 1) {
        Write-Pass "First ayah number is 1"
    } else {
        Write-Fail "First ayah number expected 1, got $($ayah1.number)"
    }
} catch {
    Write-Fail "Request failed" $_.Exception.Message
}

# ---------------------------------------------------------------------------
# Test 3: GET /api/surah/114 (Surah Detail - An-Nas)
# ---------------------------------------------------------------------------
Write-Header "Test 3: GET /api/surah/114 (Surah Detail - An-Nas)"

try {
    $result = Invoke-RestMethod -Uri "$BaseUrl/api/surah/114" -Method Get
    Write-Pass "HTTP request succeeded"

    if ($result.data.nameLatin -eq "An-Nas") {
        Write-Pass "nameLatin is An-Nas"
    } else {
        Write-Fail "nameLatin expected An-Nas, got $($result.data.nameLatin)"
    }

    if ($result.data.numberOfAyah -eq 6) {
        Write-Pass "numberOfAyah is 6"
    } else {
        Write-Fail "numberOfAyah expected 6, got $($result.data.numberOfAyah)"
    }
} catch {
    Write-Fail "Request failed" $_.Exception.Message
}

# ---------------------------------------------------------------------------
# Test 4: GET /api/search?q=esa (Search)
# ---------------------------------------------------------------------------
Write-Header "Test 4: GET /api/search?q=esa (Search)"

try {
    $result = Invoke-RestMethod -Uri "$BaseUrl/api/search?q=esa" -Method Get
    Write-Pass "HTTP request succeeded"

    if ($result.success -eq $true) {
        Write-Pass "success is true"
    } else {
        Write-Fail "success is not true"
    }

    if ($result.data.total -gt 0) {
        Write-Pass "Search returned $($result.data.total) results"
    } else {
        Write-Fail "Search returned 0 results"
    }

    $firstResult = $result.data.results[0]
    if ($firstResult.PSObject.Properties.Name -contains "surahNameLatin") {
        Write-Pass "Result has 'surahNameLatin' field"
    } else {
        Write-Fail "Result missing 'surahNameLatin' field"
    }

    if ($firstResult.PSObject.Properties.Name -contains "textArabic") {
        Write-Pass "Result has 'textArabic' field"
    } else {
        Write-Fail "Result missing 'textArabic' field"
    }

    if ($firstResult.PSObject.Properties.Name -contains "translationId") {
        Write-Pass "Result has 'translationId' field"
    } else {
        Write-Fail "Result missing 'translationId' field"
    }
} catch {
    Write-Fail "Request failed" $_.Exception.Message
}

# ---------------------------------------------------------------------------
# Test 5: Invalid surah number
# ---------------------------------------------------------------------------
Write-Header "Test 5: GET /api/surah/999 (Invalid Surah)"

try {
    $null = Invoke-RestMethod -Uri "$BaseUrl/api/surah/999" -Method Get -ErrorAction Stop
    Write-Fail "Expected error for invalid surah, but request succeeded"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -and $statusCode -ne 200) {
        Write-Pass "Non-200 status for invalid surah (got $statusCode)"
    } else {
        Write-Pass "Request failed as expected for invalid surah"
    }
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "=============================================" -ForegroundColor White
$Total = $Pass + $Fail
Write-Host "Results: $Pass/$Total passed" -ForegroundColor White
if ($Fail -gt 0) {
    Write-Host "$Fail test(s) FAILED" -ForegroundColor Red
    exit 1
} else {
    Write-Host "All tests PASSED" -ForegroundColor Green
    exit 0
}
