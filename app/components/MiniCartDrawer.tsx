"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

type MiniCartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function getImageSrc(image?: string) {
  const placeholder =
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  if (!image.startsWith("/")) return placeholder;
  return image;
}

export default function MiniCartDrawer({ open, onClose }: MiniCartDrawerProps) {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      className={[
        "fixed inset-0 z-[60]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/60 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-label="Close cart drawer"
        tabIndex={open ? 0 : -1}
      />

      {/* Panel */}
      <aside
        className={[
          "absolute right-0 top-0 h-full w-full max-w-md",
          "bg-[var(--card-bg)] border-l border-[var(--card-border)]",
          "shadow-2xl transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Mini cart"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--card-border)]">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Cart
              </h2>
              <p className="text-sm text-[var(--muted)]">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)]/30 transition"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--muted)] mb-6">Your cart is empty.</p>
                <Link
                  href="/"
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 border border-[var(--card-border)] rounded-lg p-3 bg-[var(--card-bg)]"
                >
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-[var(--card-border)]/20 flex-shrink-0">
                    <Image
                      src={getImageSrc(item.image)}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized={getImageSrc(item.image).startsWith("http")}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm font-bold text-[var(--accent)] mt-1">
                      ₹{item.price.toLocaleString()}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-lg border border-[var(--card-border)] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item._id)}
                          className="px-3 py-1.5 text-[var(--foreground)] hover:bg-[var(--card-border)]/30 transition"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-3 py-1.5 text-sm text-[var(--foreground)]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQty(item._id)}
                          className="px-3 py-1.5 text-[var(--foreground)] hover:bg-[var(--card-border)]/30 transition"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm text-red-400 hover:text-red-300 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[var(--card-border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--muted)]">Subtotal</span>
              <span className="text-base font-bold text-[var(--foreground)]">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--card-border)]/30 transition font-medium"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition font-semibold"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

