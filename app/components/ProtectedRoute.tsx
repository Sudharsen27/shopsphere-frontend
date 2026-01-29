"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { userInfo, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!userInfo) {
        router.replace("/login");
        return;
      }

      if (requireAdmin && userInfo.role !== "admin") {
        router.replace("/");
        return;
      }
    }
  }, [userInfo, loading, router, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  if (requireAdmin && userInfo.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
