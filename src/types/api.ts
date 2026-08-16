/** Supported HTTP methods for API endpoints */
export type ApiMethod = "GET";

/** Supported code snippet languages */
export type CodeSnippetLang = "curl" | "javascript" | "python" | "php";

/** API endpoint definition */
export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: ApiMethod;
  description: string;
  pathParams: ApiParam[];
  sampleResponse: Record<string, unknown>;
}

/** API path parameter */
export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue: string;
}

/** API playground state */
export interface PlaygroundState {
  selectedEndpointId: string;
  paramValues: Record<string, string>;
  response: PlaygroundResponse | null;
  isLoading: boolean;
  activeSnippetLang: CodeSnippetLang;
}

/** API playground response */
export interface PlaygroundResponse {
  status: number;
  statusText: string;
  latencyMs: number;
  data: Record<string, unknown>;
}
