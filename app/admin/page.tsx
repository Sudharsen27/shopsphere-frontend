"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userInfo || userInfo.role !== "admin") return;

      try {
        // Fetch products count
        const productsRes = await fetch(`${API_BASE}/products`);
        const products = await productsRes.json();
        const totalProducts = Array.isArray(products) ? products.length : 0;

        // Fetch orders count and revenue
        const ordersRes = await fetch(`${API_BASE}/orders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const orders = await ordersRes.json();
        const totalOrders = Array.isArray(orders) ? orders.length : 0;
        const totalRevenue = Array.isArray(orders)
          ? orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0)
          : 0;

        // Fetch users count (we'll need to create this endpoint or estimate)
        // For now, we'll skip it or use a placeholder
        const totalUsers = 0; // TODO: Add users endpoint

        setStats({
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo]);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-black text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-400">Manage your e-commerce platform</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-400">Loading stats...</p>
            </div>
          ) : stats ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Products</div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.totalProducts}</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Orders</div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalOrders}</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Users</div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">{stats.totalUsers}</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Revenue</div>
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Link
                  href="/admin/products"
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 hover:border-green-500 transition-colors"
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Manage Products</h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Add, edit, or delete products from your store
                  </p>
                </Link>

                <Link
                  href="/admin/orders"
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 hover:border-blue-500 transition-colors"
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Manage Orders</h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    View all orders and update their status
                  </p>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">Failed to load stats</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
