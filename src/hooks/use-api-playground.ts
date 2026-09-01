"use client";

import { useState, useCallback, useEffect } from "react";
import type { PlaygroundState, PlaygroundResponse, CodeSnippetLang } from "@/types/api";
import { API_ENDPOINTS, SITE_URL } from "@/constants";
import { buildEndpointUrl, generateCodeSnippet } from "@/lib/api-endpoints";

const DEFAULT_STATE: PlaygroundState = {
  selectedEndpointId: API_ENDPOINTS[0].id,
  paramValues: {},
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
      paramValues: {},
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
    const startTime = performance.now();

    try {
      const res = await fetch(url);
      const data = (await res.json()) as Record<string, unknown>;
      const clientLatencyMs = performance.now() - startTime;

      // Measure true physical HTTP network latency via W3C Resource Timing API (responseEnd - requestStart)
      let realHttpJourneyMs: number | undefined;
      if (typeof window !== "undefined" && typeof performance !== "undefined") {
        const entries = performance.getEntriesByName(url);
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as PerformanceResourceTiming;
          if (lastEntry.responseEnd > 0 && lastEntry.requestStart > 0) {
            realHttpJourneyMs = Math.round(lastEntry.responseEnd - lastEntry.requestStart);
          }
        }
      }

      const meta = data?.meta as { responseTimeMs?: number } | undefined;
      const latencyMs = realHttpJourneyMs ?? meta?.responseTimeMs ?? clientLatencyMs;

      const response: PlaygroundResponse = {
        status: res.status,
        statusText: res.statusText,
        latencyMs,
        data,
      };

      setState((prev) => ({ ...prev, isLoading: false, response }));
    } catch {
      const clientLatencyMs = performance.now() - startTime;

      const sampleMeta = selectedEndpoint.sampleResponse?.meta as { responseTimeMs?: number } | undefined;
      const latencyMs = typeof sampleMeta?.responseTimeMs === "number" ? sampleMeta.responseTimeMs : clientLatencyMs;

      // Fallback to sample response on error (e.g. CORS in dev)
      const response: PlaygroundResponse = {
        status: 200,
        statusText: "OK (Sample)",
        latencyMs,
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
