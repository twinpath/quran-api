import type { ApiEndpoint, CodeSnippetLang } from "@/types/api";
import { SAMPLE_ALFATIHAH, SAMPLE_ALIKHLAS } from "@/lib/quran-data";

/** Registry of available API endpoints */
export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "get-surah",
    name: "Get Surah",
    path: "/surah/{number}.json",
    method: "GET",
    description: "Retrieve a complete surah by number (1-114) including Arabic text, Indonesian translation, and Tafsir Kemenag.",
    pathParams: [
      {
        name: "number",
        type: "number",
        required: true,
        description: "Surah number (1-114)",
        defaultValue: "1",
      },
    ],
    sampleResponse: { "1": SAMPLE_ALFATIHAH },
  },
  {
    id: "get-surah-padded",
    name: "Get Surah (3-Digit)",
    path: "/surah-3digit/{number}.json",
    method: "GET",
    description: "Retrieve a surah by zero-padded number (001-114). Identical data, alternative URL pattern.",
    pathParams: [
      {
        name: "number",
        type: "string",
        required: true,
        description: "Zero-padded surah number (001-114)",
        defaultValue: "001",
      },
    ],
    sampleResponse: { "1": SAMPLE_ALFATIHAH },
  },
  {
    id: "get-surah-112",
    name: "Al-Ikhlas",
    path: "/surah/112.json",
    method: "GET",
    description: "Example: Retrieve Surah Al-Ikhlas (112) with 4 ayahs.",
    pathParams: [],
    sampleResponse: { "112": SAMPLE_ALIKHLAS },
  },
];

/**
 * Build a resolved URL from an endpoint path and parameter values.
 */
export function buildEndpointUrl(endpoint: ApiEndpoint, params: Record<string, string>, baseUrl: string): string {
  let resolved = endpoint.path;
  for (const param of endpoint.pathParams) {
    const value = params[param.name] || param.defaultValue;
    resolved = resolved.replace(`{${param.name}}`, value);
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

    case "nextjs":
      return `// app/surah/[id]/page.tsx
export default async function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch("${baseUrl}/surah/\${id}.json");
  const data = await res.json();

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}`;

    default:
      return "";
  }
}

/** Snippet language display labels */
export const SNIPPET_LANG_LABELS: Record<CodeSnippetLang, string> = {
  curl: "cURL",
  javascript: "JavaScript",
  python: "Python",
  nextjs: "Next.js",
};
