"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!userInfo) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/wishlist/check/${productId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setIsInWishlist(data.isInWishlist || false);
        }
      } catch (error) {
        console.error("Failed to check wishlist:", error);
      } finally {
        setChecking(false);
      }
    };

    checkWishlist();
  }, [productId, userInfo]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (res.ok) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (res.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show button while checking (prevents flicker)
  if (checking) {
    return (
      <button
        className={`${className} opacity-50 cursor-not-allowed`}
        disabled
        aria-label="Loading wishlist status"
      >
        <svg
          className="w-5 h-5 text-gray-400"
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
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${className} transition-all duration-200 hover:scale-110 ${
        loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        // Filled red heart (favorited)
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        // Outlined heart (not favorited)
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-red-500 transition-colors"
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
      )}
    </button>
  );
}
