// import Image from "next/image";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   description?: string;
// };

// async function getProduct(id: string): Promise<Product> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   return res.json();
// }

// export default async function ProductPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const product = await getProduct(params.id);

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <div className="grid md:grid-cols-2 gap-8">
//         <div className="relative h-80 bg-gray-100 rounded">
//           <Image
//             src={product.image || "/placeholder.png"}
//             alt={product.name}
//             fill
//             className="object-cover rounded"
//           />
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-4">
//             {product.name}
//           </h1>

//           <p className="text-xl text-green-600 mb-4">
//             ₹{product.price}
//           </p>

//           <p className="text-gray-600 mb-6">
//             {product.description || "No description available"}
//           </p>

//           <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }


// import Image from "next/image";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   description?: string;
// };

// // 🔹 Fix image paths
// function getImageSrc(image?: string) {
//   if (!image) return "/placeholder.png";
//   if (image.startsWith("http")) return image;
//   if (!image.startsWith("/")) return `/${image}`;
//   return image;
// }

// // 🔹 Fetch single product
// async function getProduct(id: string): Promise<Product> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   return res.json();
// }

// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ IMPORTANT FIX (Next.js 16)
//   const { id } = await params;

//   const product = await getProduct(id);

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative h-80 bg-gray-100 rounded">
//           <Image
//             src={getImageSrc(product.image)}
//             alt={product.name}
//             fill
//             className="object-cover rounded"
//           />
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-4">
//             {product.name}
//           </h1>

//           <p className="text-xl text-green-600 mb-4">
//             ₹{product.price}
//           </p>

//           {product.description && (
//             <p className="text-gray-700 mb-6">
//               {product.description}
//             </p>
//           )}

//           <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// import Image from "next/image";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   description?: string;
// };

// // 🔹 Fix image paths
// function getImageSrc(image?: string) {
//   if (!image) return "/placeholder.png";
//   if (image.startsWith("http")) return image;
//   if (!image.startsWith("/")) return `/${image}`;
//   return image;
// }

// // 🔹 Fetch single product
// async function getProduct(id: string): Promise<Product> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   return res.json();
// }

// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ IMPORTANT FIX (Next.js 16)
//   const { id } = await params;

//   const product = await getProduct(id);

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative h-80 bg-gray-100 rounded">
//           <Image
//             src={getImageSrc(product.image)}
//             alt={product.name}
//             fill
//             className="object-cover rounded"
//           />
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-4">
//             {product.name}
//           </h1>

//           <p className="text-xl text-green-600 mb-4">
//             ₹{product.price}
//           </p>

//           {product.description && (
//             <p className="text-gray-700 mb-6">
//               {product.description}
//             </p>
//           )}

//           <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductImage from "@/app/components/ProductImage";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductReviews from "@/app/components/ProductReviews";
import ReviewForm from "@/app/components/ReviewForm";
import WishlistButton from "@/app/components/WishlistButton";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  rating?: {
    average: number;
    count: number;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// 🔹 Fix image paths
function getImageSrc(image?: string) {
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  return placeholder;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${productId}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Fetch product error:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleReviewSubmitted = () => {
    setRefreshReviews((prev) => prev + 1);
    // Also refresh product to update rating
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
  };

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-gray-400 py-10">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-red-400 py-10">
          {error || "Product not found"}
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="relative h-64 sm:h-80 bg-gray-100 rounded">
          <ProductImage
            src={getImageSrc(product.image)}
            alt={product.name}
            fill
            className="object-cover rounded"
            unoptimized={product.image?.includes("unsplash.com") || !product.image}
          />
        </div>

        <div className="relative">
          {/* Wishlist Button */}
          <div className="absolute top-0 right-0">
            <WishlistButton
              productId={productId}
              className="bg-gray-900/80 rounded-full p-2"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 pr-12">
            {product.name}
          </h1>

          {/* Rating Display */}
          {product.rating && product.rating.count > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating.average} />
              <span className="text-gray-400">
                {product.rating.average.toFixed(1)} ({product.rating.count} {product.rating.count === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <p className="text-lg sm:text-xl text-green-600 mb-3 sm:mb-4">
            ₹{product.price.toLocaleString()}
          </p>

          {product.description && (
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              {product.description}
            </p>
          )}

          {/* ✅ CART BUTTON */}
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
