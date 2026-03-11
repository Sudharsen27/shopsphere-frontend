import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your ShopSphere order history.",
  robots: { index: false, follow: true },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
