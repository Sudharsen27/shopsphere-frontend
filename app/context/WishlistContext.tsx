"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type WishlistContextType = {
  wishlistIds: Set<string>;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  refetch: () => Promise<void>;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { userInfo } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!userInfo?.token) {
      setWishlistIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/wishlist`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.wishlist || [];
        const ids = new Set(list.map((p: { _id?: string }) => p._id?.toString()).filter(Boolean));
        setWishlistIds(ids);
      }
    } catch {
      setWishlistIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [userInfo?.token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const addToWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) => new Set(prev).add(productId));
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  }, []);

  const value: WishlistContextType = {
    wishlistIds,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    refetch,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  return ctx;
}
