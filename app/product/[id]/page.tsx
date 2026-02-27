"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";
import WishlistButton from "@/app/components/WishlistButton";
import ProductReviews from "@/app/components/ProductReviews";
import ReviewForm from "@/app/components/ReviewForm";
import { useAuth } from "@/app/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  brand?: string;
  rating?: {
    average: number;
    count: number;
  };
};

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
    </div>
  );
}

function getImageSrc(image?: string) {
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  return placeholder;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { userInfo } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${productId}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const message = data.message || (res.status === 404 ? "Product not found" : `Failed to load product (${res.status})`);
          setError(message);
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct(data);
      } catch (err) {
        console.error("Fetch product error:", err);
        const isNetworkError = err instanceof TypeError && (err.message === "Failed to fetch" || err.message?.includes("fetch"));
        setError(isNetworkError
          ? "Could not reach server. Make sure the backend is running and NEXT_PUBLIC_API_URL is correct."
          : "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleReviewSubmitted = () => {
    // Refresh product to get updated rating
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Refresh product error:", err);
      }
    };
    fetchProduct();
    // Trigger reviews refresh
    setRefreshReviews((prev) => prev + 1);
  };

  if (loading) {
    return (
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error || "Product not found"}</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="relative h-64 sm:h-80 bg-gray-100 rounded">
          <Image
            src={getImageSrc(product.image)}
            alt={product.name}
            fill
            className="object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("photo-1505740420928")) {
                target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
              }
            }}
            unoptimized={product.image?.includes("unsplash.com") || !product.image}
          />
        </div>

        <div className="relative">
          {/* Wishlist Heart Button */}
          <div className="absolute top-0 right-0">
            <WishlistButton
              productId={productId}
              className="bg-gray-900/80 backdrop-blur-sm rounded-full p-2 hover:bg-gray-800 transition-colors"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 pr-12">
            {product.name}
          </h1>

          {/* Rating Display */}
          {product.rating && product.rating.count > 0 && (
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <StarRating rating={product.rating.average} />
              <span className="text-sm sm:text-base text-gray-400">
                {product.rating.average.toFixed(1)} ({product.rating.count} {product.rating.count === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <p className="text-lg sm:text-xl text-green-600 mb-3 sm:mb-4">
            ₹{product.price.toLocaleString()}
          </p>

          {product.brand && (
            <p className="text-sm sm:text-base text-gray-400 mb-2">
              Brand: {product.brand}
            </p>
          )}

          {product.category && (
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
              Category: {product.category}
            </p>
          )}

          {product.description && (
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              {product.description}
            </p>
          )}

          {/* Add to Cart Button */}
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-700 pt-6 sm:pt-8">
        <ProductReviews productId={productId} refreshKey={refreshReviews} />
        <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
      </div>
    </main>
  );
}
