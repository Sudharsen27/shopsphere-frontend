"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  countInStock: number;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { userInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    brand: "",
    countInStock: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        image: data.image || "",
        category: data.category || "",
        brand: data.brand || "",
        countInStock: data.countInStock?.toString() || "",
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          image: formData.image,
          category: formData.category,
          brand: formData.brand,
          countInStock: Number(formData.countInStock),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen bg-black text-white p-4 sm:p-6">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-400">Loading product...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-black text-white p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/admin/products"
            className="text-xs sm:text-sm text-gray-400 hover:text-white mb-3 sm:mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.countInStock}
                  onChange={(e) =>
                    setFormData({ ...formData, countInStock: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/admin/products"
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
