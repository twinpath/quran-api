import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { ApiKeyItem, UseApiKeysReturn } from "@/types/account";

/**
 * Custom hook managing state and async operations for API key listing,
 * creation, revoking, and clipboard copying via real D1 backend.
 */
export function useApiKeys(): UseApiKeysReturn {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
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
          rateLimit: string;
        };
      };
      if (json.success && json.data) {
        const createdItem: ApiKeyItem = {
          id: json.data.id,
          name: json.data.name,
          keyMasked: json.data.keyMasked,
          fullKey: json.data.rawKey,
          createdAt: json.data.createdAt,
          lastUsed: "Never",
          status: "active",
          rateLimit: json.data.rateLimit,
        };

        setKeys((prev) => [createdItem, ...prev]);
        setNewKeyName("");
        setIsCreating(false);
        toast.success(`API Key "${createdItem.name}" generated! Copy your key now.`);
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

  const handleCopyKey = (key: ApiKeyItem) => {
    const textToCopy = key.fullKey || key.keyMasked;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(key.id);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevokeKey = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
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

  return {
    keys,
    newKeyName,
    setNewKeyName,
    isCreating,
    setIsCreating,
    isSubmitting,
    copiedId,
    isFetching,
    handleCreateKey,
    handleCopyKey,
    handleRevokeKey,
  };
}
