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
): string {
  const url = buildEndpointUrl(endpoint, params, baseUrl);

  switch (lang) {
    case "curl":
      return `curl -s "${url}" | jq .`;

    case "javascript":
      return `const response = await fetch("${url}");
const data = await response.json();
console.log(data);`;

    case "python":
      return `import requests

response = requests.get("${url}")
data = response.json()
print(data)`;

    case "php":
      return `<?php
$url = "${url}";
$response = file_get_contents($url);
$data = json_decode($response, true);
print_r($data);`;

    default:
      return "";
  }
}

