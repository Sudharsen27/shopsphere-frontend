"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!userInfo) return;

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    if (!userInfo) return;

    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/deliver`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, isDelivered: true }
              : order
          )
        );
        alert("Order marked as delivered");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">Manage Orders</h1>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-400">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Order ID</div>
                      <div className="font-mono text-sm">{order._id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Customer</div>
                      <div>{order.user?.name || "N/A"}</div>
                      <div className="text-sm text-gray-400">
                        {order.user?.email || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Order Items</div>
                    {order.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm mb-1"
                      >
                        <span>
                          {item.name} × {item.qty}
                        </span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">
                      Shipping Address
                    </div>
                    <div className="text-sm">
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.postalCode},{" "}
                      {order.shippingAddress?.country}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400">Total</div>
                      <div className="text-2xl font-bold">
                        ₹{order.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.isPaid ? (
                        <span className="bg-green-600 px-3 py-1 rounded text-sm">
                          Paid
                        </span>
                      ) : (
                        <span className="bg-yellow-600 px-3 py-1 rounded text-sm">
                          Unpaid
                        </span>
                      )}
                      {order.isDelivered ? (
                        <span className="bg-green-600 px-3 py-1 rounded text-sm">
                          Delivered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkDelivered(order._id)}
                          disabled={updatingId === order._id}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-1 rounded text-sm"
                        >
                          {updatingId === order._id
                            ? "Updating..."
                            : "Mark Delivered"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
