"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  Users,
  CheckCircle2,
  Clock,
  RefreshCw,
  Globe as GlobeIcon,
  Laptop,
  Smartphone,
  Server,
  AlertCircle,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorldMap } from "@/components/status/world-map";
import { Globe } from "@/components/status/globe";
import { StatusSkeleton } from "@/components/status/status-skeleton";
import type { TelemetryStatusResponse, TelemetryDistributionItem } from "@/types/telemetry";

const chartConfig = {
  requests: {
    label: "Total Requests",
    color: "var(--primary)",
  },
  errors: {
    label: "Failed Requests",
    color: "var(--destructive)",
  },
};

export function StatusPageClient() {
  const [data, setData] = useState<TelemetryStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [days, setDays] = useState("7");
  const [error, setError] = useState<string | null>(null);

  const fetchStatusData = useCallback(async (selectedDays: string, showRefreshing = true) => {
    if (showRefreshing) setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`/api/status?days=${selectedDays}`);
      if (!res.ok) throw new Error("Failed to fetch status telemetry data");
      const json: any = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        throw new Error(json.error?.message || "Unknown error");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load telemetry data.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStatusData(days, false);
    const interval = setInterval(() => fetchStatusData(days, true), 60000);
    return () => clearInterval(interval);
  }, [days, fetchStatusData]);

  if (isLoading && !data) {
    return <StatusSkeleton />;
  }

  const overview = data?.overview || {
    totalRequests: 0,
    uniqueVisitors: 0,
    successRate: 100,
    avgResponseTimeMs: 0,
    errorCount: 0,
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">API Operational Status</h1>
            <Badge variant="outline" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              <CheckCircle2 className="size-3.5" />
              All Systems Operational
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time request metrics, latency trends, and global traffic distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={days} onValueChange={setDays}>
            <TabsList className="h-9">
              <TabsTrigger value="1" className="text-xs">24h</TabsTrigger>
              <TabsTrigger value="7" className="text-xs">7d</TabsTrigger>
              <TabsTrigger value="30" className="text-xs">30d</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStatusData(days, true)}
            disabled={isRefreshing}
            className="gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total API Requests</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Logged in the last {days} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Distinct client IP hashes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.errorCount} HTTP errors logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Latency</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.avgResponseTimeMs} ms</div>
            <p className="text-xs text-muted-foreground mt-1">
              D1 execution & edge timing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Row: Timeseries Chart & 3D Globe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart (shadcn Chart + Recharts) */}
        <Card className="lg:col-span-7 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Request Volume Trend</CardTitle>
            <CardDescription>
              Volume and throughput timeline over the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pt-4">
            <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
              <AreaChart data={data?.timeseries || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis
                  dataKey="timestamp"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return days === "1"
                      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : date.toLocaleDateString([], { month: "short", day: "numeric" });
                  }}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#fillRequests)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 3D Realtime Traffic Globe */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <GlobeIcon className="size-4 text-emerald-500" />
              Live Traffic Globe
            </CardTitle>
            <CardDescription>
              Interactive 3D WebGL sphere mapping request origins.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 flex flex-col">
            <Globe locations={data?.locations || []} />
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Geographic Vector Map & Categorical Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* World Map */}
        <div className="lg:col-span-7">
          <WorldMap countries={data?.countries || []} isLoading={isRefreshing} />
        </div>

        {/* Distribution Breakdown Tabs (shadcn Progress primitives) */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Categorical Breakdown</CardTitle>
            <CardDescription>
              Traffic share across countries, regions, cities, devices, and browsers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <Tabs defaultValue="countries" className="w-full">
              <TabsList className="grid grid-cols-5 w-full mb-4 h-9">
                <TabsTrigger value="countries" className="text-xs px-1">Country</TabsTrigger>
                <TabsTrigger value="regions" className="text-xs px-1">Region</TabsTrigger>
                <TabsTrigger value="cities" className="text-xs px-1">City</TabsTrigger>
                <TabsTrigger value="browsers" className="text-xs px-1">Browser</TabsTrigger>
                <TabsTrigger value="os" className="text-xs px-1">OS</TabsTrigger>
              </TabsList>

              <TabsContent value="countries" className="mt-0">
                <DistributionList items={data?.countries || []} icon={<GlobeIcon className="size-3.5" />} />
              </TabsContent>
              <TabsContent value="regions" className="mt-0">
                <DistributionList items={data?.regions || []} icon={<Server className="size-3.5" />} />
              </TabsContent>
              <TabsContent value="cities" className="mt-0">
                <DistributionList items={data?.cities || []} icon={<Server className="size-3.5" />} />
              </TabsContent>
              <TabsContent value="browsers" className="mt-0">
                <DistributionList items={data?.browsers || []} icon={<Laptop className="size-3.5" />} />
              </TabsContent>
              <TabsContent value="os" className="mt-0">
                <DistributionList items={data?.operatingSystems || []} icon={<Smartphone className="size-3.5" />} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DistributionList({
  items,
  icon,
}: {
  items: TelemetryDistributionItem[];
  icon: React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground">
        No telemetry metrics recorded for this timeframe yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
      {items.slice(0, 8).map((item) => (
        <Progress key={item.name} value={item.percentage}>
          <div className="flex items-center justify-between w-full text-xs">
            <span className="font-medium flex items-center gap-1.5 truncate max-w-[180px]">
              {icon}
              {item.name}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {item.count.toLocaleString()} ({item.percentage}%)
            </span>
          </div>
          <ProgressTrack className="h-1.5">
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      ))}
    </div>
  );
}
