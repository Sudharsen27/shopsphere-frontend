"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  brand: string;
  countInStock: number;
};

function getImageSrc(image?: string) {
  if (!image) return "/placeholder.png";
  if (image.startsWith("http")) return image;
  if (!image.startsWith("/")) return `/${image}`;
  return image;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    if (!userInfo) return;

    setDeletingId(productId);
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productId));
        alert("Product deleted successfully");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-gray-400 hover:text-white mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold">Manage Products</h1>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
            >
              + Add Product
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-gray-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-4">No products found</p>
              <Link
                href="/admin/products/new"
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold inline-block"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4">Image</th>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Brand</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-800 hover:bg-gray-900"
                    >
                      <td className="p-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={getImageSrc(product.image)}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-400 line-clamp-1">
                          {product.description}
                        </div>
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.brand}</td>
                      <td className="p-4">₹{product.price.toLocaleString()}</td>
                      <td className="p-4">{product.countInStock}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-1 rounded text-sm"
                          >
                            {deletingId === product._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
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
