import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ProductMeta = {
  name: string;
  description?: string;
  image?: string;
  price?: number;
};

async function getProduct(id: string): Promise<ProductMeta | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.name,
      description: data.description,
      image: data.image,
      price: data.price,
    };
  } catch {
    return null;
  }
}

function getAbsoluteImageUrl(image: string | undefined, baseUrl: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http")) return image;
  try {
    return new URL(image, baseUrl).href;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const ogImage = getAbsoluteImageUrl(product.image, siteUrl) || `${siteUrl}/logoshop.png`;
  const description =
    product.description?.slice(0, 160) ||
    `Buy ${product.name} at ShopSphere. ${product.price != null ? `₹${product.price}` : ""}`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
