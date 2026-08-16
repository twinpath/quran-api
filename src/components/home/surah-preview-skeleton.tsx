import { Skeleton } from "@/components/ui/skeleton";

export function SurahPreviewSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="mb-3 h-5 w-36 rounded-full" />
        <Skeleton className="h-9 w-80 rounded-md" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-7 w-32" />
            <Skeleton className="mt-2 h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
