"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AUTH_ERROR_MESSAGES } from "@/constants/auth";
import type { UseAuthErrorReturn } from "@/types/auth";

/**
 * Custom hook to detect Better Auth error codes from URL search parameters,
 * trigger Sonner toast notifications with human-readable error descriptions,
 * and provide helper methods to handle Better Auth client API errors.
 */
export function useAuthError(): UseAuthErrorReturn {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const errorCode = errorParam;
  const errorMessage = errorParam
    ? AUTH_ERROR_MESSAGES[errorParam] ||
      "An unexpected authentication error occurred. Please try again."
    : null;

  // Display Sonner toast error notification and clean up URL query parameter
  useEffect(() => {
    if (errorParam && errorMessage) {
      toast.error(errorMessage, { duration: 8000 });

      // Clean up URL query parameter without triggering full page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [errorParam, errorMessage]);

  // Utility method to handle client API errors from Better Auth SDK calls
  const handleAuthError = useCallback((error: unknown) => {
    let message = "An error occurred during authentication.";

    if (typeof error === "string") {
      message = AUTH_ERROR_MESSAGES[error] || error;
    } else if (error && typeof error === "object") {
      const errObj = error as { code?: string; message?: string };
      if (errObj.code && AUTH_ERROR_MESSAGES[errObj.code]) {
        message = AUTH_ERROR_MESSAGES[errObj.code];
      } else if (errObj.message) {
        message = errObj.message;
      }
    }

    toast.error(message, { duration: 8000 });
  }, []);

  return {
    errorCode,
    errorMessage,
    handleAuthError,
  };
}
