"use client";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Navbar />
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}
// import type { Metadata } from "next";