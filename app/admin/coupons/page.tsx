"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Coupon = {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
};

export default function AdminCouponsPage() {
  const { userInfo } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minOrderAmount: "",
    expiresAt: "",
    usageLimit: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE}/coupons`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      code: "",
      type: "percentage",
      value: "",
      minOrderAmount: "0",
      expiresAt: "",
      usageLimit: "",
      isActive: true,
    });
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minOrderAmount: String(c.minOrderAmount || 0),
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
      isActive: c.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo || !form.code.trim() || form.value === "") return;
    setSaving(true);
    try {
      const body = {
        code: form.code.trim(),
        type: form.type,
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        expiresAt: form.expiresAt.trim() || null,
        usageLimit: form.usageLimit.trim() === "" ? null : Number(form.usageLimit),
        isActive: form.isActive,
      };
      const url = editing ? `${API_BASE}/coupons/${editing._id}` : `${API_BASE}/coupons`;
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        fetchCoupons();
        alert(editing ? "Coupon updated" : "Coupon created");
      } else {
        alert(data.message || "Failed to save coupon");
      }
    } catch (err) {
      alert("Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    if (!userInfo) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c._id !== id));
        alert("Coupon deleted");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-black text-white p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link href="/admin" className="text-sm text-gray-400 hover:text-white mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold">Coupons</h1>
            </div>
            <button
              onClick={openCreate}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
            >
              + Add Coupon
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{editing ? "Edit Coupon" : "New Coupon"}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Code</label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      className="w-full p-2 border border-gray-600 rounded bg-black"
                      placeholder="SAVE10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
                      className="w-full p-2 border border-gray-600 rounded bg-black"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Value {form.type === "percentage" ? "(%)" : "(₹)"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={form.type === "percentage" ? 100 : undefined}
                      step={form.type === "percentage" ? 1 : 0.01}
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded bg-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Min order (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.minOrderAmount}
                      onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded bg-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Expires (optional)</label>
                    <input
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded bg-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Usage limit (optional)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded bg-black"
                      placeholder="Unlimited"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-medium disabled:opacity-50"
                    >
                      {saving ? "Saving..." : editing ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
              <p className="mt-4 text-gray-400">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20 border border-gray-800 rounded-lg">
              <p className="text-gray-400 mb-4">No coupons yet</p>
              <button onClick={openCreate} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold">
                Create first coupon
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-800 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/50">
                    <th className="text-left p-3">Code</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Value</th>
                    <th className="text-left p-3">Min order</th>
                    <th className="text-left p-3">Used</th>
                    <th className="text-left p-3">Expires</th>
                    <th className="text-left p-3">Active</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c._id} className="border-b border-gray-800 hover:bg-gray-900/30">
                      <td className="p-3 font-mono font-semibold">{c.code}</td>
                      <td className="p-3">{c.type}</td>
                      <td className="p-3">
                        {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
                      </td>
                      <td className="p-3">₹{(c.minOrderAmount || 0).toLocaleString()}</td>
                      <td className="p-3">
                        {c.usedCount}
                        {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                      </td>
                      <td className="p-3 text-gray-400">
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-3">{c.isActive ? "Yes" : "No"}</td>
                      <td className="p-3">
                        <button
                          onClick={() => openEdit(c)}
                          className="text-blue-400 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={deletingId === c._id}
                          className="text-red-400 hover:underline disabled:opacity-50"
                        >
                          {deletingId === c._id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
