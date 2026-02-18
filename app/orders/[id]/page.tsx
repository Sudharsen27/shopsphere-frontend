"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import Link from "next/link";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  image?: string;
  product: string;
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
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getImageSrc(image?: string) {
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  return placeholder;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userInfo, loading: authLoading } = useAuth();
  const hasFetched = useRef(false);
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (authLoading || !orderId) return;

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

    const fetchOrder = async () => {
      hasFetched.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/orders/${orderId}`, {
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

        if (res.status === 404) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch order (${res.status})`);
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err instanceof Error ? err.message : "Failed to load order. Please try again.");
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [userInfo, authLoading, orderId, router]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        <p className="text-center text-gray-400 py-10">Loading...</p>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        <p className="text-center text-gray-400 py-10">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        <div className="text-center py-10">
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                hasFetched.current = false;
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Retry
            </button>
            <Link
              href="/orders"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        <p className="text-center text-gray-400 py-10">Order not found</p>
        <div className="text-center">
          <Link
            href="/orders"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Link
          href="/orders"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          ← Back to Orders
        </Link>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-900">
          <p className="text-sm text-gray-400 mb-1">Payment Status</p>
          <p className={`text-lg font-semibold ${order.isPaid ? "text-green-400" : "text-yellow-400"}`}>
            {order.isPaid ? "✓ Paid" : "Pending"}
          </p>
          {order.isPaid && order.paidAt && (
            <p className="text-xs text-gray-500 mt-1">
              Paid on {new Date(order.paidAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="border border-gray-700 p-4 rounded-lg bg-gray-900">
          <p className="text-sm text-gray-400 mb-1">Delivery Status</p>
          <p className={`text-lg font-semibold ${order.isDelivered ? "text-green-400" : "text-yellow-400"}`}>
            {order.isDelivered ? "✓ Delivered" : "Processing"}
          </p>
          {order.isDelivered && order.deliveredAt && (
            <p className="text-xs text-gray-500 mt-1">
              Delivered on {new Date(order.deliveredAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Order Info */}
      <div className="border border-gray-700 p-6 rounded-lg bg-gray-900 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Order ID:</span>
            <span className="font-mono">{order._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Order Date:</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Payment Method:</span>
            <span className="uppercase">{order.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border border-gray-700 p-6 rounded-lg bg-gray-900 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 pb-4 border-b border-gray-700 last:border-0 last:pb-0"
            >
              <div className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
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
                  unoptimized={item.image?.includes("unsplash.com") || !item.image}
                />
              </div>
              <div className="flex-1">
                <Link
                  href={`/product/${item.product}`}
                  className="text-lg font-semibold hover:text-green-400 transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-400">Quantity: {item.qty}</p>
                <p className="text-green-400 font-semibold mt-1">
                  ₹{(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border border-gray-700 p-6 rounded-lg bg-gray-900 mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-1 text-sm">
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Price Summary */}
      <div className="border border-gray-700 p-6 rounded-lg bg-gray-900">
        <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Items Price:</span>
            <span>₹{order.itemsPrice.toLocaleString()}</span>
          </div>
          {order.taxPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Tax:</span>
              <span>₹{order.taxPrice.toLocaleString()}</span>
            </div>
          )}
          {order.shippingPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping:</span>
              <span>₹{order.shippingPrice.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-700">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-green-400">
              ₹{order.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
