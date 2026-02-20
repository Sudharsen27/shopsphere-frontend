"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!orderId) {
      // Use setTimeout to ensure navigation happens after render
      setTimeout(() => {
        router.push("/orders");
      }, 0);
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout to ensure navigation happens after render
          setTimeout(() => {
            router.push(`/orders/${orderId}`);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Your order has been placed successfully
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-400 mb-2">Order ID</p>
          <p className="text-lg font-semibold text-white font-mono">
            #{orderId?.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href={`/orders/${orderId}`}
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            View Order Details
          </Link>
          <Link
            href="/orders"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            View All Orders
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mt-6">
          Redirecting to order details in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="animate-pulse">
            <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
