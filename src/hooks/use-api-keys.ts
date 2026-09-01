import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { ApiKeyItem, UseApiKeysReturn } from "@/types/account";
import type { ExpirationOption } from "@/types/api-key";

/**
 * Custom hook managing state and async operations for API key listing,
 * creation via Sheet, expiration handling, revoking, and deleting via D1 backend.
 */
export function useApiKeys(): UseApiKeysReturn {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [expirationOption, setExpirationOption] = useState<ExpirationOption>("30d");
  const [customDays, setCustomDays] = useState<number>(30);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRawKey, setCreatedRawKey] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchKeys() {
      try {
        const res = await fetch("/api/keys");
        if (res.ok) {
          const json = (await res.json()) as { success: boolean; data?: ApiKeyItem[] };
          if (json.success && Array.isArray(json.data)) {
            setKeys(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load API keys:", err);
      } finally {
        setIsFetching(false);
      }
    }
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for your API key");
      return;
    }

    if (expirationOption === "custom" && (!customDays || customDays <= 0)) {
      toast.error("Please enter a valid number of days for custom expiration");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName.trim(),
          expirationOption,
          customDays: expirationOption === "custom" ? customDays : undefined,
        }),
      });

      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        data?: {
          id: string;
          name: string;
          keyMasked: string;
          rawKey: string;
          createdAt: string;
          expiresAt: string | null;
          expiresLabel: string;
          rateLimit: string;
        };
      };
      if (json.success && json.data) {
        const createdItem: ApiKeyItem = {
          id: json.data.id,
          name: json.data.name,
          keyMasked: json.data.keyMasked,
          createdAt: json.data.createdAt,
          expiresAt: json.data.expiresAt,
          expiresLabel: json.data.expiresLabel,
          isExpired: false,
          lastUsed: "Never",
          status: "active",
          rateLimit: json.data.rateLimit,
        };

        setKeys((prev) => [createdItem, ...prev]);
        setCreatedRawKey(json.data.rawKey);
        toast.success(`API Key "${createdItem.name}" generated successfully!`);
      } else {
        toast.error(json.error || "Failed to create API key");
      }
    } catch (err) {
      console.error("Error creating API key:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeKey = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "PATCH" });
      if (res.ok) {
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)),
        );
        toast.info(`API Key "${name}" has been revoked`);
      } else {
        toast.error("Failed to revoke API key");
      }
    } catch (err) {
      console.error("Error revoking key:", err);
      toast.error("Failed to revoke API key");
    }
  };

  const handleDeleteKey = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        toast.success(`API Key "${name}" deleted permanently`);
      } else {
        toast.error("Failed to delete API key");
      }
    } catch (err) {
      console.error("Error deleting key:", err);
      toast.error("Failed to delete API key");
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setNewKeyName("");
    setExpirationOption("30d");
    setCustomDays(30);
    setCreatedRawKey(null);
  };

  return {
    keys,
    newKeyName,
    setNewKeyName,
    expirationOption,
    setExpirationOption,
    customDays,
    setCustomDays,
    isSheetOpen,
    setIsSheetOpen,
    isSubmitting,
    createdRawKey,
    isFetching,
    handleCreateKey,
    handleRevokeKey,
    handleDeleteKey,
    handleCloseSheet,
  };
}
