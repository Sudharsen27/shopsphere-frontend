"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import WishlistButton from "../components/WishlistButton";

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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }

    const fetchWishlist = async () => {
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
    };

    fetchWishlist();
  }, [userInfo, router]);

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
        // Remove product from local state
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error("Remove from wishlist error:", err);
    }
  };

  if (!userInfo) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Loading wishlist...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Try again
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
        <div className="text-center py-20 border border-gray-700 rounded-lg bg-gray-900">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            Your wishlist is empty
          </p>
          <Link
            href="/"
            className="inline-block text-blue-400 hover:text-blue-300 underline text-sm sm:text-base"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-400">
            {products.length} {products.length === 1 ? "item" : "items"} in your wishlist
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-700 rounded-lg p-3 sm:p-4 hover:border-green-500 hover:shadow-lg transition-all duration-200 bg-gray-900 relative group"
              >
                {/* Wishlist Heart Button */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-gray-800 transition-colors"
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
                  <div className="relative h-40 sm:h-48 w-full mb-3 sm:mb-4 bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={getImageSrc(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover rounded group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("photo-1505740420928")) {
                          target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
                        }
                      }}
                      unoptimized={product.image?.includes("unsplash.com") || !product.image}
                    />
                  </div>

                  <h2 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-green-400 transition-colors pr-8">
                    {product.name}
                  </h2>

                  {product.brand && (
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">{product.brand}</p>
                  )}

                  <p className="text-lg sm:text-xl font-bold text-green-500">
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
