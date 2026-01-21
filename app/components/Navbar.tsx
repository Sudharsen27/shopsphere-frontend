

"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartItems } = useCart();

  const totalQty = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold">
        ShopSphere
      </Link>

      <Link href="/cart" className="font-medium">
        Cart{" "}
        <span suppressHydrationWarning>
          ({totalQty})
        </span>
      </Link>
    </nav>
  );
}
