"use client";

import { useState, useEffect } from "react";
import { Key, Plus, Copy, Check, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_API_KEYS } from "@/constants/account";
import type { ApiKeyItem, ApiKeysManagerProps } from "@/types/account";

export function ApiKeysManager({ isLoading = false }: ApiKeysManagerProps) {
  const [keys, setKeys] = useState<ApiKeyItem[]>(DEFAULT_API_KEYS);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

        setKeys([createdItem, ...keys]);
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
        setKeys(
          keys.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)),
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

  return (
    <div className="space-y-6">
      {/* Top Banner Info */}
      <Card className="border-border shadow-none bg-muted/30">
        <CardContent className="p-4 flex items-start gap-3 text-sm">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">API Key & Rate Limiting</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              API Keys allow your applications to authenticate with the Quran API service.
              Include your key in request headers as <code className="bg-muted px-1.5 py-0.5 font-mono text-xs border border-border">X-API-Key: YOUR_KEY</code> or query parameter <code className="bg-muted px-1.5 py-0.5 font-mono text-xs border border-border">?api_key=YOUR_KEY</code>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table Card */}
      <Card className="border-border shadow-none">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Your API Keys
            </CardTitle>
            <CardDescription>
              Manage active credentials for accessing Quran API endpoints
            </CardDescription>
          </div>

          <Button
            onClick={() => setIsCreating(!isCreating)}
            size="sm"
            className="gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New Key
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Inline Create Key Form */}
          {isCreating && (
            <form onSubmit={handleCreateKey} className="p-4 bg-muted/40 border border-border space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Generate New API Key
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Key name (e.g. My Website, Flutter App)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 text-sm"
                  disabled={isSubmitting}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm" disabled={isSubmitting} className="cursor-pointer">
                    {isSubmitting ? "Generating..." : "Generate"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Keys List */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border">
              No API keys created yet. Click &quot;Create New Key&quot; above.
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((keyItem) => {
                const isRevoked = keyItem.status === "revoked";
                return (
                  <div
                    key={keyItem.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border gap-4 transition-colors ${
                      isRevoked ? "bg-muted/20 opacity-60" : "bg-card hover:bg-muted/10"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{keyItem.name}</span>
                        {isRevoked ? (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Revoked</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <code className="font-mono text-xs text-foreground/80 bg-muted px-1 py-0.5">
                          {keyItem.keyMasked}
                        </code>
                        <span>Created: {keyItem.createdAt}</span>
                        <span>Used: {keyItem.lastUsed}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isRevoked && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyKey(keyItem)}
                            className="gap-1.5 text-xs cursor-pointer"
                          >
                            {copiedId === keyItem.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeKey(keyItem.id, keyItem.name)}
                            className="gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Revoke
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
