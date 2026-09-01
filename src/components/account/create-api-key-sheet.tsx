"use client";

import { useState } from "react";
import { Key, Copy, Check, AlertTriangle, Calendar, ShieldAlert } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { EXPIRATION_OPTIONS } from "@/constants/api-key";
import type { ExpirationOption } from "@/types/api-key";
import { toast } from "sonner";

interface CreateApiKeySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newKeyName: string;
  onKeyNameChange: (name: string) => void;
  expirationOption: ExpirationOption;
  onExpirationOptionChange: (option: ExpirationOption) => void;
  customDays: number;
  onCustomDaysChange: (days: number) => void;
  isSubmitting: boolean;
  createdRawKey: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}

export function CreateApiKeySheet({
  isOpen,
  onOpenChange,
  newKeyName,
  onKeyNameChange,
  expirationOption,
  onExpirationOptionChange,
  customDays,
  onCustomDaysChange,
  isSubmitting,
  createdRawKey,
  onSubmit,
  onClose,
}: CreateApiKeySheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyRawKey = () => {
    if (!createdRawKey) return;
    navigator.clipboard.writeText(createdRawKey);
    setCopied(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  const comboboxItems = EXPIRATION_OPTIONS.map((opt) => opt.value);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
      else onOpenChange(open);
    }}>
      <SheetContent side="right" className="w-full sm:max-w-md p-6 flex flex-col justify-between">
        <div>
          <SheetHeader className="p-0 mb-6 space-y-1.5">
            <SheetTitle className="flex items-center gap-2 text-base font-semibold">
              <Key className="h-5 w-5 text-primary shrink-0" />
              {createdRawKey ? "Save Your API Key" : "Generate New API Key"}
            </SheetTitle>
            <SheetDescription className="text-xs leading-relaxed">
              {createdRawKey
                ? "Your new API Key has been generated. Please copy and store it securely."
                : "Create credentials to authenticate requests against Quran API endpoints."}
            </SheetDescription>
          </SheetHeader>

          {/* STEP 2: RAW KEY CREATED - SHOW ONCE ONLY */}
          {createdRawKey ? (
            <div className="space-y-5">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Important Security Notice</span>
                </div>
                <p className="leading-relaxed opacity-90">
                  Make sure to copy your API key now. You will <strong className="font-semibold underline">never be able to see or copy it again</strong> once this drawer is closed.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Generated Key</label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={createdRawKey}
                    className="font-mono text-xs bg-muted border-border select-all flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopyRawKey}
                    className="gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 1: FORM INPUTS */
            <form id="create-api-key-form" onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="key-name-input" className="text-xs font-medium text-foreground">
                  Key Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="key-name-input"
                  type="text"
                  placeholder="e.g. Mobile App, Production Backend"
                  value={newKeyName}
                  onChange={(e) => onKeyNameChange(e.target.value)}
                  className="text-xs"
                  disabled={isSubmitting}
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground">
                  What is this API key being used for?
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Expiration Option
                </label>
                
                <Combobox
                  items={comboboxItems}
                  value={expirationOption}
                  onValueChange={(val) => {
                    if (val) onExpirationOptionChange(val as ExpirationOption);
                  }}
                >
                  <ComboboxInput
                    placeholder="Select expiration preset..."
                    className="w-full text-xs"
                    disabled={isSubmitting}
                    showTrigger
                  />
                  <ComboboxContent className="w-full z-50">
                    <ComboboxList>
                      {EXPIRATION_OPTIONS.map((opt) => (
                        <ComboboxItem key={opt.value} value={opt.value} className="text-xs py-2">
                          <div className="flex items-center justify-between w-full pr-1">
                            <span className="font-medium text-foreground">{opt.label}</span>
                          </div>
                        </ComboboxItem>
                      ))}
                      <ComboboxEmpty>No option found</ComboboxEmpty>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                <p className="text-[11px] text-muted-foreground">
                  The token will automatically expire after the selected duration.
                </p>
              </div>

              {expirationOption === "custom" && (
                <div className="space-y-2 p-3 bg-muted/30 border border-border">
                  <label htmlFor="custom-days-input" className="text-xs font-medium text-foreground">
                    Custom Expiration (Days)
                  </label>
                  <Input
                    id="custom-days-input"
                    type="number"
                    min={1}
                    max={1095}
                    value={customDays}
                    onChange={(e) => onCustomDaysChange(parseInt(e.target.value, 10) || 1)}
                    className="text-xs"
                    disabled={isSubmitting}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Specify valid lifetime in days (e.g. 45 days).
                  </p>
                </div>
              )}

              {expirationOption === "never" && (
                <div className="p-3 bg-muted/40 border border-border flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Keys with no expiration may pose a security risk if compromised. We recommend setting an expiration date.
                  </span>
                </div>
              )}
            </form>
          )}
        </div>

        <SheetFooter className="p-0 mt-6 pt-4 border-t border-border flex-row gap-2 justify-end">
          {createdRawKey ? (
            <Button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer"
            >
              Done & Close
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-api-key-form"
                size="sm"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Generating..." : "Generate Key"}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
