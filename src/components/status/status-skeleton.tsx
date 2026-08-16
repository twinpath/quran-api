import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatusSkeleton() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Timeseries Chart & Globe Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Trend Chart Skeleton */}
        <Card className="lg:col-span-7 flex flex-col">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="flex-1 min-h-[320px] p-6 flex flex-col justify-end gap-4">
            <Skeleton className="w-full h-48 rounded-md" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </CardContent>
        </Card>

        {/* Realtime 3D Globe Skeleton */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex-1 min-h-[320px] p-4 flex items-center justify-center">
            <Skeleton className="size-64 rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* World Map & Category Breakdowns Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* World Map Skeleton */}
        <Card className="lg:col-span-7 flex flex-col">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent className="flex-1 min-h-[340px] p-4 flex items-center justify-center">
            <Skeleton className="w-full h-[300px] rounded-md" />
          </CardContent>
        </Card>

        {/* Distribution Tabs Skeleton */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-none" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
