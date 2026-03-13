import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order at ShopSphere. Enter shipping details and choose payment method.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Checkout | ShopSphere",
    description: "Secure checkout. Enter shipping and payment details.",
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
