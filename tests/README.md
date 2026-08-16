# Quran Edge API Integration Tests

This folder contains test scripts written in 5 different environments/programming languages to verify that all API endpoints of the Quran Edge API are fully functional and adhere to the expected schema definition.

## Test Matrix

| Environment | Script Path | Dependencies | Command |
| :--- | :--- | :--- | :--- |
| **Bash (Linux/macOS)** | [`tests/bash/test-api.sh`](file:///c:/Users/dyzulk/Documents/twinpath/quran-json/tests/bash/test-api.sh) | `curl`, `grep` | `bash tests/bash/test-api.sh` |
| **PowerShell** | [`tests/powershell/test-api.ps1`](file:///c:/Users/dyzulk/Documents/twinpath/quran-json/tests/powershell/test-api.ps1) | PowerShell 5.1 / 7+ | `pwsh -File tests/powershell/test-api.ps1` |
| **JavaScript (Node.js)** | [`tests/javascript/test-api.mjs`](file:///c:/Users/dyzulk/Documents/twinpath/quran-json/tests/javascript/test-api.mjs) | Node.js 18+ (Native Fetch) | `node tests/javascript/test-api.mjs` |
| **Python** | [`tests/python/test_api.py`](file:///c:/Users/dyzulk/Documents/twinpath/quran-json/tests/python/test_api.py) | Python 3.x (Standard library `urllib`) | `python tests/python/test_api.py` |
| **PHP** | [`tests/php/test-api.php`](file:///c:/Users/dyzulk/Documents/twinpath/quran-json/tests/php/test-api.php) | PHP 7.4+ (`file_get_contents`) | `php tests/php/test-api.php` |

## Environment Variables

All scripts support changing the target host using the `BASE_URL` environment variable. By default, they point to production:

```bash
# Example testing against a local dev environment
BASE_URL="http://localhost:3000" node tests/javascript/test-api.mjs
```
