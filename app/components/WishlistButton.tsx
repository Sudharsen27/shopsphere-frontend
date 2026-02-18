"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if product is in wishlist
  useEffect(() => {
    if (!userInfo) {
      setChecking(false);
      return;
    }

    const checkWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE}/wishlist/check/${productId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setIsInWishlist(data.isInWishlist);
        }
      } catch (error) {
        console.error("Check wishlist error:", error);
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
      const method = isInWishlist ? "DELETE" : "POST";
      const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
        method,
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        setIsInWishlist(!isInWishlist);
      } else {
        const data = await res.json();
        console.error("Wishlist toggle error:", data.message);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <button
        className={`${className} text-gray-400 hover:text-gray-300 transition-colors`}
        disabled
      >
        <svg
          className="w-6 h-6"
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
      className={`${className} transition-colors ${
        isInWishlist
          ? "text-red-500 hover:text-red-400"
          : "text-gray-400 hover:text-red-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className="w-6 h-6"
        fill={isInWishlist ? "currentColor" : "none"}
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
