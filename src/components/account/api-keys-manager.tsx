"use client";

import { Key, Plus, Trash2, Info, Ban, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiKeys } from "@/hooks/use-api-keys";
import { CreateApiKeySheet } from "@/components/account/create-api-key-sheet";
import type { ApiKeysManagerProps } from "@/types/account";

export function ApiKeysManager({ isLoading = false }: ApiKeysManagerProps) {
  const {
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
  } = useApiKeys();

  const showSkeleton = isLoading || isFetching;

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
              Manage active credentials and expiration lifecycles for accessing Quran API endpoints
            </CardDescription>
          </div>

          <Button
            onClick={() => setIsSheetOpen(true)}
            size="sm"
            className="gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create New Key
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Slide-Over Sheet Component */}
          <CreateApiKeySheet
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            newKeyName={newKeyName}
            onKeyNameChange={setNewKeyName}
            expirationOption={expirationOption}
            onExpirationOptionChange={setExpirationOption}
            customDays={customDays}
            onCustomDaysChange={setCustomDays}
            isSubmitting={isSubmitting}
            createdRawKey={createdRawKey}
            onSubmit={handleCreateKey}
            onClose={handleCloseSheet}
          />

          {/* Keys List */}
          {showSkeleton ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border">
              No API keys created yet. Click &quot;Create New Key&quot; above to generate credentials.
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((keyItem) => {
                const isRevoked = keyItem.status === "revoked";
                const isExpired = keyItem.status === "expired" || keyItem.isExpired;

                return (
                  <div
                    key={keyItem.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border gap-4 transition-colors ${
                      isRevoked || isExpired ? "bg-muted/20 opacity-70" : "bg-card hover:bg-muted/10"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{keyItem.name}</span>
                        
                        {isRevoked ? (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Revoked</Badge>
                        ) : isExpired ? (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                            Active
                          </Badge>
                        )}

                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          {keyItem.expiresLabel}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <code className="font-mono text-xs text-foreground/80 bg-muted px-1.5 py-0.5 border border-border">
                          {keyItem.keyMasked}
                        </code>
                        <span>Created: {keyItem.createdAt}</span>
                        <span>Used: {keyItem.lastUsed}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {keyItem.status === "active" && !isExpired ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeKey(keyItem.id, keyItem.name)}
                          className="gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Revoke
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteKey(keyItem.id, keyItem.name)}
                          className="gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
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

