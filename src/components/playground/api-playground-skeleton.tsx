import { Skeleton } from "@/components/ui/skeleton";

export function ApiPlaygroundSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-96 max-w-full" />
      </div>
      <div className="border border-border bg-card p-6">
        <div className="border-b border-border pb-4">
          <Skeleton className="mb-3 h-5 w-40" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-md" />
            ))}
          </div>
        </div>
        <div className="py-4">
          <Skeleton className="mb-4 h-10 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
