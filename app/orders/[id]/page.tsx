"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { OrderDetailSkeleton } from "../../components/ProductCardSkeleton";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  image?: string;
  product?: string;
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
  discountAmount?: number;
  couponCode?: string;
  createdAt: string;
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  deliveredAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: string }> = {
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

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${config.bg} ${config.text} ${config.border} border backdrop-blur-sm`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const { userInfo, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const hasFetched = useRef(false);
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (authLoading || !id) return;

    if (!userInfo) {
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.replace("/login");
      }
      return;
    }

    if (!userInfo.token || hasFetched.current) {
      if (!id) setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      hasFetched.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/orders/${id}`, {
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
          setError("Order not found.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Failed to load order (${res.status})`);
        }

        const data = await res.json();
        let status = data.status;
        if (!status) {
          if (data.isDelivered) status = "delivered";
          else if (data.isPaid) status = "processing";
          else status = "pending";
        }
        setOrder({ ...data, status });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order.");
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userInfo, authLoading, router]);

  const handleCancelOrder = async () => {
    if (!order || !userInfo?.token || cancelling) return;
    const s = order.status || "pending";
    if (s !== "pending" && s !== "processing") return;
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
        toastError(data.message || "Failed to cancel order");
        return;
      }
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      toastSuccess("Order cancelled.");
    } catch {
      toastError("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (authLoading || (loading && !error)) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <OrderDetailSkeleton />
      </div>
    );
  }

  if (!userInfo) return null;

  if (error && !order) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-6"
        >
          ← Back to Orders
        </Link>
        <div className="text-center py-12 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            href="/orders"
            className="inline-block px-6 py-2 bg-[var(--accent)] hover:opacity-90 rounded-lg text-white font-medium"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const status = order.status || "pending";
  const canCancel = (status === "pending" || status === "processing") && !order.isDelivered;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-6"
      >
        ← Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-[var(--muted)] mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
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
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Items */}
        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Order Items</h2>
          <ul className="space-y-4">
            {order.orderItems.map((item, idx) => (
              <li
                key={idx}
                className="flex gap-4 py-3 border-b border-[var(--card-border)] last:border-0"
              >
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[var(--card-border)] overflow-hidden">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-[var(--muted)]">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    Qty: {item.qty} × ₹{Number(item.price).toLocaleString()} = ₹
                    {(item.qty * item.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex-shrink-0 font-semibold text-[var(--foreground)]">
                  ₹{(item.qty * item.price).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Shipping Address */}
        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Shipping Address</h2>
          <address className="text-[var(--muted)] not-italic">
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </address>
        </section>

        {/* Payment & Status */}
        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Payment & Status</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Payment method</dt>
              <dd className="text-[var(--foreground)] font-medium">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Payment status</dt>
              <dd className={order.isPaid ? "text-green-400 font-medium" : "text-yellow-400"}>
                {order.isPaid ? `Paid ${order.paidAt ? new Date(order.paidAt).toLocaleDateString() : ""}` : "Not paid"}
              </dd>
            </div>
            {order.isDelivered && order.deliveredAt && (
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Delivered on</dt>
                <dd className="text-[var(--foreground)]">
                  {new Date(order.deliveredAt).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </dd>
              </div>
            )}
          </dl>
          {userInfo?.email && (
            <Link
              href={`/track?order=${order._id}&email=${encodeURIComponent(userInfo.email)}`}
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90"
            >
              Track order
            </Link>
          )}
        </section>

        {/* Totals */}
        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">Order Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Items</dt>
              <dd className="text-[var(--foreground)]">₹{Number(order.itemsPrice).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Tax</dt>
              <dd className="text-[var(--foreground)]">₹{Number(order.taxPrice).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Shipping</dt>
              <dd className="text-[var(--foreground)]">₹{Number(order.shippingPrice).toLocaleString()}</dd>
            </div>
            {order.discountAmount != null && order.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <dt>
                  Discount {order.couponCode ? `(${order.couponCode})` : ""}
                </dt>
                <dd>- ₹{Number(order.discountAmount).toLocaleString()}</dd>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-[var(--card-border)] text-base font-bold">
              <dt className="text-[var(--foreground)]">Total</dt>
              <dd className="text-[var(--accent)]">₹{Number(order.totalPrice).toLocaleString()}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
