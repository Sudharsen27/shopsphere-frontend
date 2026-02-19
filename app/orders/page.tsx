"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  image?: string;
};

type Order = {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  deliveredAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Status badge component with modern styling
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: {
      label: "Pending",
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
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${config.bg} ${config.text} ${config.border} border backdrop-blur-sm transition-all duration-300 hover:scale-105`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userInfo, loading: authLoading } = useAuth();
  const hasFetched = useRef(false);
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (!userInfo) {
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.replace("/login");
      }
      return;
    }

    if (hasFetched.current) return;

    if (!userInfo.token) {
      setError("Authentication token missing. Please login again.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      hasFetched.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/orders/myorders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          if (!isRedirecting.current) {
            isRedirecting.current = true;
            router.replace("/login");
          }
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch orders (${res.status})`);
        }

        const data = await res.json();
        const ordersData = Array.isArray(data) ? data : data.orders || [];
        
        // Calculate status if not present
        const ordersWithStatus = ordersData.map((order: Order) => {
          if (!order.status) {
            if (order.isDelivered) {
              order.status = "delivered";
            } else if (order.isPaid) {
              order.status = "processing";
            } else {
              order.status = "pending";
            }
          }
          return order;
        });
        
        setOrders(ordersWithStatus);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err instanceof Error ? err.message : "Failed to load orders. Please try again.");
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, authLoading, router]);

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Orders</h1>
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          My Orders
        </h1>
        {orders.length > 0 && (
          <span className="text-sm sm:text-base text-gray-400">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-gray-400">Loading orders...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => {
                hasFetched.current = false;
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-300">No orders yet</h2>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order, index) => {
            const orderStatus = order.status || (order.isDelivered ? "delivered" : order.isPaid ? "processing" : "pending");
            
            return (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block group"
              >
                <div className="border border-gray-700 rounded-xl p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm hover:border-green-500/50 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 transform hover:-translate-y-1">
                  {/* Header with Order ID and Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center text-lg sm:text-xl font-bold">
                        #
                      </div>
                      <div>
                        <p className="font-semibold text-base sm:text-lg text-white group-hover:text-green-400 transition-colors">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={orderStatus} />
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.orderItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm sm:text-base py-2 border-b border-gray-700/50 last:border-0"
                      >
                        <span className="text-gray-300 flex-1">
                          {item.name} <span className="text-gray-500">× {item.qty}</span>
                        </span>
                        <span className="font-medium text-gray-200">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <p className="text-xs sm:text-sm text-gray-500 pt-2">
                        +{order.orderItems.length - 3} more item{order.orderItems.length - 3 !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Footer with Total and View Details */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Total Amount</p>
                      <p className="font-bold text-lg sm:text-xl text-green-400">
                        ₹{order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 group-hover:text-green-300 transition-colors">
                      <span className="text-sm sm:text-base font-medium">View Details</span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
