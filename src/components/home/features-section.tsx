"use client";

import { Zap, FileJson, ShieldCheck, BookMarked, Hash, Globe, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES, SITE_NAME } from "@/constants";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  Zap,
  FileJson,
  ShieldCheck,
  BookMarked,
  Hash,
  Globe,
  Database,
};

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">Why {SITE_NAME}?</h2>
        <p className="mt-2 text-muted-foreground">
          Built for developers who need reliable, fast, and accurate Quran data.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = ICON_MAP[feature.iconName] ?? Globe;
          return (
            <Card
              key={feature.title}
              className="group transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
