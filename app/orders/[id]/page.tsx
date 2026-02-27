"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  image?: string;
};

type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type Order = {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  createdAt: string;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  deliveredAt?: string;
};

function getImageSrc(image?: string) {
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  return placeholder;
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: {
      label: "Pending Payment",
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/50",
      icon: "⏳",
    },
    processing: {
      label: "Processing",
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/50",
      icon: "🔄",
    },
    shipped: {
      label: "Shipped",
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/50",
      icon: "📦",
    },
    delivered: {
      label: "Delivered",
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/50",
      icon: "✅",
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/50",
      icon: "❌",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-semibold ${config.bg} ${config.text} ${config.border} border backdrop-blur-sm`}>
      <span className="text-lg">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}

// Progress Steps Component
function OrderProgress({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Order Placed", icon: "📝" },
    { key: "processing", label: "Processing", icon: "🔄" },
    { key: "shipped", label: "Shipped", icon: "📦" },
    { key: "delivered", label: "Delivered", icon: "✅" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(status);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                    : "bg-gray-700 text-gray-500"
                } ${isCurrent ? "ring-4 ring-green-500/30 scale-110" : ""}`}
              >
                {isActive ? step.icon : index + 1}
              </div>
              <span
                className={`text-xs sm:text-sm mt-2 text-center ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress Line */}
      <div className="absolute top-5 sm:top-6 left-0 right-0 h-0.5 bg-gray-700 -z-10">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { userInfo, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!userInfo) {
      router.replace("/login");
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch order");
        }

        const data = await res.json();
        
        // Calculate status if not present
        if (!data.status) {
          if (data.isDelivered) {
            data.status = "delivered";
          } else if (data.isPaid) {
            data.status = "processing";
          } else {
            data.status = "pending";
          }
        }
        
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (params.id && userInfo?.token) {
      fetchOrder();
    }
  }, [params.id, userInfo, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-gray-400">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-300">Order Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "The order you're looking for doesn't exist"}</p>
          <Link
            href="/orders"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderStatus = order.status || (order.isDelivered ? "delivered" : order.isPaid ? "processing" : "pending");
  const canCancel = orderStatus === "pending" || orderStatus === "processing";

  const handleCancelOrder = async () => {
    if (!userInfo?.token || !canCancel || cancelling) return;
    if (!confirm("Cancel this order? Stock will be restored.")) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/orders/${order._id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || "Failed to cancel order");
        return;
      }
      setOrder({ ...order, status: "cancelled" });
    } catch {
      alert("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/track?order=${order._id}&email=${encodeURIComponent(userInfo?.email ?? "")}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              Track this order
            </Link>
            {canCancel && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel order"}
              </button>
            )}
            <StatusBadge status={orderStatus} />
          </div>
        </div>
      </div>

      {/* Order Progress */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order Status</h2>
        <OrderProgress status={orderStatus} />
      </div>

      {/* Order Items */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                <Image
                  src={getImageSrc(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("photo-1505740420928")) {
                      target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
                    }
                  }}
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-white mb-1 truncate">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">Quantity: {item.qty}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm sm:text-base text-green-400">
                  ₹{(item.price * item.qty).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Shipping Address */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-2 text-sm sm:text-base text-gray-300">
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Method:</span>
              <span className="text-white font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Status:</span>
              <span className={order.isPaid ? "text-green-400 font-medium" : "text-yellow-400 font-medium"}>
                {order.isPaid ? "Paid" : "Pending"}
              </span>
            </div>
            {order.paidAt && (
              <div className="text-xs sm:text-sm text-gray-500 mt-2">
                Paid on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            )}
            {order.deliveredAt && (
              <div className="text-xs sm:text-sm text-gray-500 mt-2">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-gray-400">Items Price:</span>
            <span className="text-white">₹{order.itemsPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-gray-400">Shipping:</span>
            <span className="text-white">₹{order.shippingPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-gray-400">Tax:</span>
            <span className="text-white">₹{order.taxPrice.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-lg sm:text-xl font-semibold text-white">Total:</span>
              <span className="text-lg sm:text-xl font-bold text-green-400">
                ₹{order.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
