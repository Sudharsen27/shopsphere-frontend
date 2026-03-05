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
