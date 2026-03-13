import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart at ShopSphere. Review items and proceed to checkout.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Cart | ShopSphere",
    description: "Review your cart and checkout at ShopSphere.",
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
