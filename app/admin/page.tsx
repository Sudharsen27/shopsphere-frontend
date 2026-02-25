"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { getAdminStats } from "@/lib/api";

type Stats = {
  totalOrders: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
  ordersToday: number;
  ordersThisMonth: number;
  totalUsers: number;
  lowStockCount: number;
  lowStockProducts: Array<{ _id: string; name: string; countInStock: number; price: number }>;
  recentOrders: any[];
  topProducts: Array<{ name: string; totalQty: number; totalRevenue: number; productId: string }>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") return;
    getAdminStats()
      .then(setStats)
      .catch((e) => console.error("Failed to fetch stats:", e))
      .finally(() => setLoading(false));
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
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Orders</div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalOrders}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Revenue</div>
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Revenue Today</div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-400">
                    ₹{stats.revenueToday.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stats.ordersToday} orders today</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Revenue This Month</div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                    ₹{stats.revenueThisMonth.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stats.ordersThisMonth} orders this month</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Users</div>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{stats.totalUsers}</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">Low Stock Products</div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.lowStockCount}</div>
                  <p className="text-xs text-gray-500 mt-1">≤5 in stock</p>
                </div>
              </div>

              {/* Recent Orders & Low Stock & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 lg:col-span-2">
                  <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
                  {stats.recentOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-400 border-b border-gray-700">
                            <th className="pb-2 pr-2">Order</th>
                            <th className="pb-2 pr-2">User</th>
                            <th className="pb-2 pr-2">Total</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentOrders.slice(0, 5).map((o: any) => (
                            <tr key={o._id} className="border-b border-gray-800">
                              <td className="py-2 pr-2 font-mono text-xs">{o._id?.slice(-8)}</td>
                              <td className="py-2 pr-2">{o.user?.name || o.user?.email || "—"}</td>
                              <td className="py-2 pr-2">₹{(o.totalPrice || 0).toLocaleString()}</td>
                              <td className="py-2">{o.status || "pending"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No orders yet</p>
                  )}
                  <Link href="/admin/orders" className="inline-block mt-3 text-sm text-green-400 hover:underline">View all orders →</Link>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6">
                  <h2 className="text-lg font-semibold mb-3">Low Stock</h2>
                  {stats.lowStockProducts?.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {stats.lowStockProducts.slice(0, 5).map((p: any) => (
                        <li key={p._id} className="flex justify-between">
                          <span className="text-gray-300 truncate max-w-[140px]" title={p.name}>{p.name}</span>
                          <span className="text-amber-400 font-medium">{p.countInStock} left</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">All good</p>
                  )}
                  <Link href="/admin/products" className="inline-block mt-3 text-sm text-green-400 hover:underline">Manage products →</Link>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-lg font-semibold mb-3">Top Products (by quantity sold)</h2>
                {stats.topProducts?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="pb-2 pr-2">Product</th>
                          <th className="pb-2 pr-2">Qty sold</th>
                          <th className="pb-2">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topProducts.slice(0, 8).map((p: any, i: number) => (
                          <tr key={p.productId || i} className="border-b border-gray-800">
                            <td className="py-2 pr-2 text-gray-300">{p.name}</td>
                            <td className="py-2 pr-2">{p.totalQty}</td>
                            <td className="py-2">₹{(p.totalRevenue || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No sales data yet</p>
                )}
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

                <Link
                  href="/admin/coupons"
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 hover:border-amber-500 transition-colors"
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Coupons</h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Create and manage discount codes
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
