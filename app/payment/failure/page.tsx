"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const orderId = searchParams.get("orderId");
  const reason = searchParams.get("reason") || "Payment failed";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout to ensure navigation happens after render
          setTimeout(() => {
            router.push("/checkout");
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-red-400"
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
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Payment Failed</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {decodeURIComponent(reason)}
          </p>
        </div>

        {orderId && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-400 mb-2">Order ID</p>
            <p className="text-lg font-semibold text-white font-mono">
              #{orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Your order was created but payment was not completed. You can retry payment or choose COD.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Try Again
          </Link>
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              View Order
            </Link>
          )}
          <Link
            href="/orders"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            View All Orders
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mt-6">
          Redirecting to checkout in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
