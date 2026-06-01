import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-blush/30",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-blush/20">
      <Skeleton className="h-48 md:h-56 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-16" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <Skeleton className="h-[400px] md:h-[500px] rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
