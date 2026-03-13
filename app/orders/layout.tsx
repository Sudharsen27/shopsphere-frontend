import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your orders at ShopSphere.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "My Orders | ShopSphere",
    description: "Track your order history and status.",
  },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
