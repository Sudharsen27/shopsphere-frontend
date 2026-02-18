"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import WishlistButton from "../components/WishlistButton";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getImageSrc(image?: string) {
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  return placeholder;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userInfo, loading: authLoading } = useAuth();
  const hasFetched = useRef(false);
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (!userInfo) {
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.replace("/login");
      }
      return;
    }

    if (hasFetched.current) return;

    if (!userInfo.token) {
      setError("Authentication token missing. Please login again.");
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      hasFetched.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/wishlist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          if (!isRedirecting.current) {
            isRedirecting.current = true;
            router.replace("/login");
          }
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch wishlist (${res.status})`);
        }

        const data = await res.json();
        setWishlist(data.wishlist || []);
      } catch (err) {
        console.error("Fetch wishlist error:", err);
        setError(err instanceof Error ? err.message : "Failed to load wishlist. Please try again.");
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userInfo, authLoading, router]);

  const handleRemove = (productId: string) => {
    // Remove from local state immediately for better UX
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Wishlist</h1>
        <p className="text-center text-gray-400 py-10">Loading...</p>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Wishlist</h1>

      {loading ? (
        <p className="text-center text-gray-400 py-10 text-sm sm:text-base">Loading wishlist...</p>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => {
              hasFetched.current = false;
              setError(null);
              setLoading(true);
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4 text-sm sm:text-base">Your wishlist is empty.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white inline-block text-sm sm:text-base"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="border border-gray-700 rounded-lg p-3 sm:p-4 hover:border-green-500 hover:shadow-lg transition-all duration-200 bg-gray-900 relative group"
            >
              {/* Wishlist Button */}
              <div className="absolute top-2 right-2 z-10">
                <WishlistButton
                  productId={product._id}
                  className="bg-gray-900/80 rounded-full p-1"
                />
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

                <h2 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                  {product.name}
                </h2>

                <p className="text-lg sm:text-xl font-bold text-green-500">
                  ₹{product.price.toLocaleString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
