"use client";

import { BookOpen, ScrollText, Layers, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STATS } from "@/constants";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import type { LoadingProps } from "@/types/components";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  BookOpen,
  ScrollText,
  Layers,
  Zap,
};

export function StatsOverview({ isLoading }: LoadingProps) {
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
                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {isLoading ? <Skeleton className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="font-heading text-3xl font-bold tracking-tight">
                  {isLoading ? <Skeleton className="h-8 w-24" /> : stat.value}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {isLoading ? <Skeleton className="mt-1 h-4 w-32" /> : stat.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {isLoading ? <Skeleton className="mt-1 h-3 w-40" /> : stat.description}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}


