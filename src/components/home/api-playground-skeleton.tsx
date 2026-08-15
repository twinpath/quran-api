import { Skeleton } from "@/components/ui/skeleton";

export function ApiPlaygroundSkeleton() {
  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border p-4">
        <Skeleton className="mb-3 h-5 w-40" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>
      </div>
      <div className="p-4">
        <Skeleton className="mb-4 h-10 w-full rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    </div>
  );
}
