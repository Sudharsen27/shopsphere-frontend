"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type TrackOrder = {
  _id: string;
  orderId: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
  orderItems: { name: string; qty: number; price: number }[];
  totalPrice: number;
  shippingAddress: { address: string; city: string; postalCode: string; country: string };
};

const STEPS = [
  { key: "pending", label: "Order placed", icon: "📝" },
  { key: "processing", label: "Processing", icon: "🔄" },
  { key: "shipped", label: "Shipped", icon: "📦" },
  { key: "delivered", label: "Delivered", icon: "✅" },
];

const STATUS_INDEX: Record<string, number> = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qOrder = searchParams.get("order") || searchParams.get("orderId") || "";
  const qEmail = searchParams.get("email") || "";

  useEffect(() => {
    if (qOrder && qEmail) {
      setOrderId(qOrder);
      setEmail(qEmail);
    }
  }, [qOrder, qEmail]);

  useEffect(() => {
    if (!qOrder.trim() || !qEmail.trim()) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/orders/track?orderId=${encodeURIComponent(qOrder.trim())}&email=${encodeURIComponent(qEmail.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message && !data._id) {
          setError(data.message);
          setOrder(null);
        } else {
          setOrder(data);
          setError(null);
        }
      })
      .catch(() => {
        setError("Could not load tracking. Check order ID and email.");
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [qOrder, qEmail]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      setError("Please enter order ID and email.");
      return;
    }
    setLoading(true);
    setError(null);
    fetch(
      `${API_BASE}/orders/track?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message && !data._id) {
          setError(data.message);
          setOrder(null);
        } else {
          setOrder(data);
          setError(null);
        }
      })
      .catch(() => {
        setError("Could not load tracking. Check order ID and email.");
        setOrder(null);
      })
      .finally(() => setLoading(false));
  };

  const currentIndex = order ? STATUS_INDEX[order.status] ?? 0 : 0;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
          ← Back to Shop
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Track your order</h1>
        <p className="text-gray-400 mb-6">Enter your order ID and email to see status. No login required.</p>

        <form onSubmit={handleTrack} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Paste full order ID (e.g. from email)"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used for this order"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Track order"}
          </button>
        </form>

        {loading && !order && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
              <p className="text-gray-400 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-lg font-semibold text-green-400 capitalize">{order.status}</p>
              <p className="text-sm text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
              </p>
            </div>

            {order.status !== "cancelled" && (
              <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
                <h2 className="font-semibold mb-3">Status timeline</h2>
                <div className="space-y-3">
                  {STEPS.map((step, i) => {
                    const done = currentIndex >= i;
                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            done ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {done ? "✓" : step.icon}
                        </div>
                        <span className={done ? "text-white" : "text-gray-400"}>{step.label}</span>
                        {step.key === "delivered" && order.deliveredAt && (
                          <span className="text-xs text-gray-500 ml-auto">
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
              <h2 className="font-semibold mb-2">Items</h2>
              <ul className="space-y-1 text-sm">
                {order.orderItems.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span className="text-gray-300">{item.name} × {item.qty}</span>
                    <span>₹{(item.price * item.qty).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 pt-2 border-t border-gray-700 font-semibold flex justify-between">
                <span>Total</span>
                <span className="text-green-400">₹{order.totalPrice.toLocaleString()}</span>
              </p>
            </div>

            {order.shippingAddress && (
              <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
                <h2 className="font-semibold mb-1">Shipping address</h2>
                <p className="text-sm text-gray-300">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-gray-400">Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
