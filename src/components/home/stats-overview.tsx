"use client";

import { BookOpen, ScrollText, Layers, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { STATS } from "@/constants";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  BookOpen,
  ScrollText,
  Layers,
  Zap,
};

export function StatsOverview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = ICON_MAP[stat.iconName] ?? BookOpen;
          return (
            <Card
              key={stat.label}
              className="group transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-heading text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-foreground">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
