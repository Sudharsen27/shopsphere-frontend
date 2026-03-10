"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="border border-gray-700 rounded-lg p-3 sm:p-4 bg-gray-900 animate-pulse">
      <div className="relative h-40 sm:h-48 w-full mb-3 sm:mb-4 bg-gray-800 rounded-lg" />
      <div className="h-5 bg-gray-800 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-800 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-800 rounded w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for product detail page loading */
export function ProductDetailSkeleton() {
  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="relative h-64 sm:h-80 bg-gray-800 rounded-lg animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-800 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-800 rounded w-1/4 animate-pulse" />
          <div className="h-5 bg-gray-800 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </main>
  );
}

/** Skeleton for single order detail page loading */
export function OrderDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="h-5 bg-gray-700 rounded w-32" />
      <div className="flex justify-between">
        <div>
          <div className="h-8 bg-gray-700 rounded w-56 mb-2" />
          <div className="h-4 bg-gray-700 rounded w-64" />
        </div>
        <div className="h-9 bg-gray-700 rounded-full w-24" />
      </div>
      <div className="rounded-xl border border-[var(--card-border)] p-4 sm:p-6 space-y-4">
        <div className="h-5 bg-gray-700 rounded w-28 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 py-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-700" />
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
            <div className="h-5 bg-gray-700 rounded w-20" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--card-border)] p-4 sm:p-6">
        <div className="h-5 bg-gray-700 rounded w-36 mb-3" />
        <div className="h-4 bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-700 rounded w-2/3" />
      </div>
      <div className="rounded-xl border border-[var(--card-border)] p-4 sm:p-6">
        <div className="h-5 bg-gray-700 rounded w-32 mb-3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-6 bg-gray-700 rounded w-24 mt-3" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for orders list page loading */
export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-[var(--card-border)] rounded-xl p-4 sm:p-6 bg-[var(--card-bg)] animate-pulse"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-700" />
              <div>
                <div className="h-5 bg-gray-700 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-40" />
              </div>
            </div>
            <div className="h-8 bg-gray-700 rounded-full w-24" />
          </div>
          <div className="space-y-2 mb-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex justify-between py-2">
                <div className="h-4 bg-gray-700 rounded w-48" />
                <div className="h-4 bg-gray-700 rounded w-16" />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 border-t border-[var(--card-border)]">
            <div>
              <div className="h-3 bg-gray-700 rounded w-20 mb-2" />
              <div className="h-6 bg-gray-700 rounded w-24" />
            </div>
            <div className="h-9 bg-gray-700 rounded w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
