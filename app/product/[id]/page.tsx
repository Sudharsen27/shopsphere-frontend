"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";
import WishlistButton from "@/app/components/WishlistButton";
import ProductReviews from "@/app/components/ProductReviews";
import ReviewForm from "@/app/components/ReviewForm";
import { ProductDetailSkeleton } from "@/app/components/ProductCardSkeleton";
import { trackEvent } from "@/lib/analytics";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [productId]);

  useEffect(() => {
    if (!product?._id) return;
    trackEvent("view_product", {
      productId: product._id,
      name: product.name,
      price: product.price,
      category: product.category || undefined,
      brand: product.brand || undefined,
    });
  }, [product?._id]);

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
    setRefreshReviews((prev) => prev + 1);
  };

  // Fetch related products (same category, exclude current)
  useEffect(() => {
    if (!product?.category) {
      setRelatedProducts([]);
      return;
    }
    const params = new URLSearchParams({ category: product.category, sort: "createdAt", order: "desc" });
    fetch(`${API_BASE}/products?${params}`)
      .then((res) => res.ok ? res.json() : { products: [] })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.products || []);
        const related = list.filter((p: Product) => p._id !== productId).slice(0, 4);
        setRelatedProducts(related);
      })
      .catch(() => setRelatedProducts([]));
  }, [product?.category, productId]);

  if (loading) {
    return <ProductDetailSkeleton />;
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

  const galleryImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images && product.images.length ? product.images : []),
  ].filter(Boolean);
  const mainImageSrc = galleryImages[selectedImageIndex] ?? product.image;
  const hasGallery = galleryImages.length > 1;

  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="space-y-3">
          <div className="relative h-64 sm:h-80 bg-[var(--card-border)]/20 rounded-lg overflow-hidden border border-[var(--card-border)]">
            <Image
              src={getImageSrc(mainImageSrc)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              unoptimized={getImageSrc(mainImageSrc).startsWith("http")}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("photo-1505740420928")) {
                  target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
                }
              }}
            />
          </div>
          {hasGallery && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === idx
                      ? "border-green-500 ring-2 ring-green-500/30"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <Image
                    src={getImageSrc(img)}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={getImageSrc(img).startsWith("http")}
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
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

          {/* Delivery & Returns */}
          <div className="mt-6 p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Delivery & returns</h3>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              <li>• Delivery in 3–5 business days</li>
              <li>• Free delivery on orders above ₹499</li>
              <li>• 7-day easy returns if unused and in original packaging</li>
              <li>• Contact support for any issues</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-[var(--card-border)] pt-6 sm:pt-8">
        <ProductReviews productId={productId} refreshKey={refreshReviews} />
        <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[var(--card-border)] pt-8 mt-8">
          <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="group block border border-[var(--card-border)] rounded-lg p-3 bg-[var(--card-bg)] hover:border-[var(--accent)] transition-all duration-200 active:scale-[0.98]"
              >
                <div className="relative aspect-square w-full mb-2 rounded-md bg-[var(--card-border)]/20 overflow-hidden">
                  <Image
                    src={getImageSrc(p.image)}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    unoptimized={getImageSrc(p.image).startsWith("http")}
                  />
                </div>
                <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                  {p.name}
                </p>
                <p className="text-sm font-bold text-[var(--accent)] mt-1">₹{p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
