import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
  return (
    <div className="space-y-16">
      {/* Hero skeleton */}
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <Skeleton className="mx-auto h-12 w-64" />
        <Skeleton className="mx-auto h-5 w-full max-w-lg" />
        <Skeleton className="mx-auto h-5 w-full max-w-md" />
      </div>

      {/* Principles skeleton */}
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-6 text-center">
            <Skeleton className="mx-auto mb-4 h-11 w-11 rounded-lg" />
            <Skeleton className="mx-auto mb-2 h-5 w-24" />
            <Skeleton className="mx-auto h-4 w-full" />
            <Skeleton className="mx-auto mt-1 h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Lineage skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-6">
              <Skeleton className="mb-3 h-9 w-9 rounded-md" />
              <Skeleton className="mb-2 h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Architecture skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="mx-auto max-w-2xl space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
