import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "ShopSphere admin dashboard. Manage orders, products, and store settings.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
