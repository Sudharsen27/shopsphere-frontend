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
  status?: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const { userInfo } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>(STATUS_OPTIONS[0]);
  const [bulkLoading, setBulkLoading] = useState(false);

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

  const handleSingleStatusUpdate = async (orderId: string, status: string) => {
    if (!userInfo) return;

    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status,
                  isDelivered: status === "delivered",
                }
              : order
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(orders.map((o) => o._id)));
  };

  const handleBulkStatusUpdate = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || !userInfo) return;
    setBulkLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/orders/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ ids, status: bulkStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOrders(
          orders.map((o) =>
            selectedIds.has(o._id)
              ? { ...o, status: bulkStatus, isDelivered: bulkStatus === "delivered" }
              : o
          )
        );
        setSelectedIds(new Set());
        alert(data.message || "Orders updated");
      } else {
        alert(data.message || "Bulk update failed");
      }
    } catch {
      alert("Bulk update failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportCsv = async () => {
    if (!userInfo) return;
    try {
      const res = await fetch(`${API_BASE}/admin/orders/export`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-black text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="text-xs sm:text-sm text-gray-400 hover:text-white mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Manage Orders</h1>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium text-sm"
            >
              Export CSV
            </button>
          </div>

          {selectedIds.size > 0 && (
            <div className="mb-4 p-3 bg-gray-900 border border-gray-700 rounded-lg flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-300">{selectedIds.size} selected</span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleBulkStatusUpdate}
                disabled={bulkLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-1.5 rounded text-sm"
              >
                {bulkLoading ? "Updating…" : "Update status"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="bg-gray-600 hover:bg-gray-500 px-3 py-1.5 rounded text-sm"
              >
                Clear selection
              </button>
            </div>
          )}

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
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={orders.length > 0 && selectedIds.size === orders.length}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
                <span className="text-sm text-gray-400">Select all</span>
              </div>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 flex gap-3"
                >
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order._id)}
                      onChange={() => toggleSelect(order._id)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-3 sm:mb-4">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-400">Order ID</div>
                      <div className="font-mono text-xs sm:text-sm break-all">{order._id}</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm text-gray-400">Customer</div>
                      <div className="text-sm sm:text-base">{order.user?.name || "N/A"}</div>
                      <div className="text-xs sm:text-sm text-gray-400">
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

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-400">Total</div>
                      <div className="text-xl sm:text-2xl font-bold">
                        ₹{order.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {order.isPaid ? (
                        <span className="bg-green-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                          Paid
                        </span>
                      ) : (
                        <span className="bg-yellow-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                          Unpaid
                        </span>
                      )}
                      {order.isDelivered ? (
                        <span className="bg-green-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                          Delivered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkDelivered(order._id)}
                          disabled={updatingId === order._id}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          {updatingId === order._id
                            ? "Updating..."
                            : "Mark Delivered"}
                        </button>
                      )}
                      {order.status && order.status !== "delivered" && (
                        <span className="bg-gray-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm capitalize">
                          {order.status}
                        </span>
                      )}
                      <select
                        value={order.status || "pending"}
                        onChange={(e) =>
                          handleSingleStatusUpdate(order._id, e.target.value)
                        }
                        disabled={updatingId === order._id}
                        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs sm:text-sm capitalize disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </div>
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
