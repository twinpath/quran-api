"use client";

import { useState, useCallback, useEffect } from "react";
import type { PlaygroundState, PlaygroundResponse, CodeSnippetLang } from "@/types/api";
import { API_ENDPOINTS, SITE_URL } from "@/constants";
import { buildEndpointUrl, generateCodeSnippet } from "@/lib/api-endpoints";
import {
  getLatencyTimestamp,
  calculateElapsedMs,
  extractNetworkLatencyMs,
  extractServerLatencyMs,
} from "@/lib/latency";

function getInitialParamValues(endpointId: string): Record<string, string> {
  const endpoint = API_ENDPOINTS.find((e) => e.id === endpointId) ?? API_ENDPOINTS[0];
  const initial: Record<string, string> = {};
  for (const param of endpoint.pathParams) {
    initial[param.name] = param.defaultValue;
  }
  return initial;
}

const DEFAULT_STATE: PlaygroundState = {
  selectedEndpointId: API_ENDPOINTS[0].id,
  paramValues: getInitialParamValues(API_ENDPOINTS[0].id),
  response: null,
  isLoading: false,
  activeSnippetLang: "curl",
};

/**
 * Hook for managing the interactive API playground state.
 */
export function useApiPlayground() {
  const [state, setState] = useState<PlaygroundState>(DEFAULT_STATE);
  const [origin, setOrigin] = useState<string>(SITE_URL);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handle = requestAnimationFrame(() => {
        setOrigin(window.location.origin);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, []);

  const selectedEndpoint = API_ENDPOINTS.find((e) => e.id === state.selectedEndpointId) ?? API_ENDPOINTS[0];

  const selectEndpoint = useCallback((endpointId: string) => {
    setState((prev) => ({
      ...prev,
      selectedEndpointId: endpointId,
      paramValues: getInitialParamValues(endpointId),
      response: null,
    }));
  }, []);

  const setParamValue = useCallback((name: string, value: string) => {
    setState((prev) => ({
      ...prev,
      paramValues: { ...prev.paramValues, [name]: value },
    }));
  }, []);

  const setSnippetLang = useCallback((lang: CodeSnippetLang) => {
    setState((prev) => ({ ...prev, activeSnippetLang: lang }));
  }, []);

  const executeRequest = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, response: null }));

    const url = buildEndpointUrl(selectedEndpoint, state.paramValues, origin);
    const start = getLatencyTimestamp();

    try {
      const res = await fetch(url);
      const data = (await res.json()) as Record<string, unknown>;
      const fallbackMs = calculateElapsedMs(start);

      // Network RTT via W3C Resource Timing API
      const networkLatencyMs = extractNetworkLatencyMs(url) ?? fallbackMs;
      // Server execution time from JSON response meta
      const serverTimeMs = extractServerLatencyMs(data);

      const response: PlaygroundResponse = {
        status: res.status,
        statusText: res.statusText,
        latencyMs: networkLatencyMs,
        serverTimeMs,
        data,
      };

      setState((prev) => ({ ...prev, isLoading: false, response }));
    } catch {
      const fallbackMs = calculateElapsedMs(start);
      const serverTimeMs = extractServerLatencyMs(selectedEndpoint.sampleResponse);

      // Fallback to sample response on error (e.g. CORS in dev)
      const response: PlaygroundResponse = {
        status: 200,
        statusText: "OK (Sample)",
        latencyMs: fallbackMs,
        serverTimeMs,
        data: selectedEndpoint.sampleResponse,
      };

      setState((prev) => ({ ...prev, isLoading: false, response }));
    }
  }, [selectedEndpoint, state.paramValues, origin]);

  const resolvedUrl = buildEndpointUrl(selectedEndpoint, state.paramValues, origin);

  const codeSnippet = generateCodeSnippet(
    selectedEndpoint,
    state.paramValues,
    state.activeSnippetLang,
    origin,
  );

  return {
    state,
    selectedEndpoint,
    endpoints: API_ENDPOINTS,
    resolvedUrl,
    codeSnippet,
    selectEndpoint,
    setParamValue,
    setSnippetLang,
    executeRequest,
  };
}
