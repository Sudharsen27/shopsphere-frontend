"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import WishlistButton from "../components/WishlistButton";
import EmptyState from "../components/EmptyState";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";
import { useToast } from "../context/ToastContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string;
}

function getImageSrc(image?: string) {
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  return placeholder;
}

export default function WishlistPage() {
  const { userInfo } = useAuth();
  const wishlistContext = useWishlist();
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!userInfo) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/wishlist`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.wishlist || []);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        throw new Error("Failed to fetch wishlist");
      }
    } catch (err) {
      console.error("Fetch wishlist error:", err);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [router, userInfo]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }
    fetchWishlist();
  }, [fetchWishlist, router, userInfo]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!userInfo) return;

    try {
      const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        wishlistContext?.removeFromWishlist(productId);
        toast.info("Removed from wishlist");
      }
    } catch (err) {
      console.error("Remove from wishlist error:", err);
      toast.error("Could not remove. Try again.");
    }
  };

  if (!userInfo) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-9 w-56 bg-[var(--card-border)]/30 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-80 bg-[var(--card-border)]/30 rounded-lg animate-pulse" />
        </div>
        <ProductGridSkeleton count={8} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchWishlist}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
        My Wishlist
      </h1>

      {products.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          title="Your wishlist is empty"
          description="Save items you like and find them here later."
          actionLabel="Browse products"
          actionHref="/"
        />
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-400">
            {products.length} {products.length === 1 ? "item" : "items"} in your wishlist
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border border-[var(--card-border)] rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-200 bg-[var(--card-bg)] relative group"
              >
                {/* Wishlist Heart Button */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-[var(--card-border)]/30 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                <Link href={`/product/${product._id}`} className="block">
                  <div className="relative h-40 sm:h-48 w-full mb-3 sm:mb-4 bg-[var(--card-border)]/20 rounded-lg overflow-hidden border border-[var(--card-border)]">
                    <Image
                      src={getImageSrc(product.image)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover rounded group-hover:scale-105 transition-transform duration-200"
                      unoptimized={getImageSrc(product.image).startsWith("http")}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("photo-1505740420928")) {
                          target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
                        }
                      }}
                    />
                  </div>

                  <h2 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors pr-8 text-[var(--foreground)]">
                    {product.name}
                  </h2>

                  {product.brand && (
                    <p className="text-xs sm:text-sm text-[var(--muted)] mb-1">{product.brand}</p>
                  )}

                  <p className="text-lg sm:text-xl font-bold text-[var(--accent)]">
                    ₹{product.price.toLocaleString()}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
