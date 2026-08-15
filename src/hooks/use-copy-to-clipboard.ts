"use client";

import { useState, useCallback } from "react";

/**
 * Hook for copying text to the clipboard with a temporary success state.
 */
export function useCopyToClipboard(resetDelayMs = 2000) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), resetDelayMs);
        return true;
      } catch {
        setHasCopied(false);
        return false;
      }
    },
    [resetDelayMs],
  );

  return { hasCopied, copy };
}
