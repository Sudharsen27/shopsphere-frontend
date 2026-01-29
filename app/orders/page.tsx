"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (authLoading) return;

    if (!userInfo) {
      router.replace("/login");
      return;
    }

    const fetchOrders = async () => {
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

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, authLoading, router]);

  if (authLoading || (!userInfo && !error)) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <p className="text-center text-gray-400 py-10">Loading...</p>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-400 py-10">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-700 p-4 rounded mb-4"
          >
            <p className="font-semibold">Order ID: {order._id}</p>

            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <p className="font-bold mt-2">Total: ₹{order.totalPrice}</p>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
