import type { ApiEndpoint, CodeSnippetLang } from "@/types/api";

export { API_PATHS, API_ENDPOINTS, SNIPPET_LANG_LABELS } from "@/constants";

/**
 * Build a resolved URL from an endpoint path and parameter values.
 */
export function buildEndpointUrl(endpoint: ApiEndpoint, params: Record<string, string>, baseUrl: string): string {
  let resolved = endpoint.path;
  for (const param of endpoint.pathParams) {
    const value = params[param.name] || param.defaultValue;
    // URL-encode parameter values safely (e.g. for search query parameters)
    const encodedValue = encodeURIComponent(value);
    resolved = resolved.replace(`{${param.name}}`, encodedValue);
  }
  return `${baseUrl}${resolved}`;
}

/**
 * Generate a code snippet for the given endpoint, language, and parameters.
 */
export function generateCodeSnippet(
  endpoint: ApiEndpoint,
  params: Record<string, string>,
  lang: CodeSnippetLang,
  baseUrl: string,
  apiKey?: string,
): string {
  const url = buildEndpointUrl(endpoint, params, baseUrl);
  const cleanApiKey = apiKey?.trim();

  switch (lang) {
    case "curl":
      if (cleanApiKey) {
        return `# With jq (formatted):
curl -s -H "X-API-Key: ${cleanApiKey}" "${url}" | jq .

# Alternative (raw JSON):
curl -s -H "X-API-Key: ${cleanApiKey}" "${url}"`;
      }
      return `# With jq (formatted):
curl -s "${url}" | jq .

# Alternative (raw JSON):
curl -s "${url}"`;

    case "javascript":
      if (cleanApiKey) {
        return `const response = await fetch("${url}", {
  headers: {
    "X-API-Key": "${cleanApiKey}",
  },
});
const data = await response.json();
console.log(data);`;
      }
      return `const response = await fetch("${url}");
const data = await response.json();
console.log(data);`;

    case "python":
      if (cleanApiKey) {
        return `import urllib.request
import json

headers = {
    "User-Agent": "Mozilla/5.0",
    "X-API-Key": "${cleanApiKey}",
}
req = urllib.request.Request("${url}", headers=headers)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode("utf-8"))
    print(data)`;
      }
      return `import urllib.request
import json

req = urllib.request.Request("${url}", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode("utf-8"))
    print(data)`;

    case "php":
      if (cleanApiKey) {
        return `<?php
$url = "${url}";
$options = [
    "http" => [
        "method" => "GET",
        "header" => "X-API-Key: ${cleanApiKey}\\r\\n"
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);
$data = json_decode($response, true);
print_r($data);`;
      }
      return `<?php
$url = "${url}";
$response = file_get_contents($url);
$data = json_decode($response, true);
print_r($data);`;

    default:
      return "";
  }
}

