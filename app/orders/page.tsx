"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userInfo, loading: authLoading } = useAuth();
  const hasFetched = useRef(false);
  const isRedirecting = useRef(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Redirect if not authenticated (only once)
    if (!userInfo) {
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.replace("/login");
      }
      return;
    }

    // Prevent multiple fetches
    if (hasFetched.current) return;

    // Ensure token exists
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
          // Token expired or invalid
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
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err instanceof Error ? err.message : "Failed to load orders. Please try again.");
        hasFetched.current = false; // Allow retry on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, authLoading]); // Removed router from dependencies

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <p className="text-center text-gray-400 py-10">Loading...</p>
      </div>
    );
  }

  // Don't render if redirecting
  if (!userInfo) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading orders...</p>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              hasFetched.current = false;
              setError(null);
              setLoading(true);
              // Trigger re-fetch by updating a dependency
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-700 p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="font-semibold text-lg">Order ID: {order._id.slice(-8)}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2 mb-3">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gray-700 pb-2">
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-medium">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <p className="font-bold text-lg text-green-400">
                  Total: ₹{order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
