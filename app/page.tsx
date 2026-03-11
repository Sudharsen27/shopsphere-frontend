// export default function HomePage() {
//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold">
//         ShopSphere
//       </h1>

//       <p className="mt-2 text-gray-600">
//         Products will be loaded here from backend
//       </p>
//     </main>
//   );
// }

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image: string;
// };

// async function getProducts(): Promise<Product[]> {
//   const res = await fetch("http://localhost:5000/api/products", {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }

//   return res.json();
// }

// export default async function HomePage() {
//   const products = await getProducts();

//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold mb-6">
//         ShopSphere
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <div
//             key={product._id}
//             className="border rounded-lg p-4"
//           >
//             <img
//               src={product.image}
//               alt={product.name}
//               className="h-40 w-full object-cover mb-3"
//             />

//             <h2 className="text-lg font-semibold">
//               {product.name}
//             </h2>

//             <p className="text-gray-700">
//               ₹{product.price}
//             </p>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }


// import Image from "next/image";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
// };

// async function getProducts(): Promise<Product[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products`,
//     {
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }

//   return res.json();
// }

// export default async function HomePage() {
//   const products = await getProducts();

//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold mb-6">ShopSphere</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <div
//             key={product._id}
//             className="border rounded-lg p-4 hover:shadow-lg transition"
//           >
//             <div className="relative h-40 w-full mb-3 bg-gray-100 rounded">
//               <Image
//                 src={product.image || "/placeholder.png"}
//                 alt={product.name}
//                 fill
//                 className="object-cover rounded"
//               />
//             </div>

//             <h2 className="text-lg font-semibold">
//               {product.name}
//             </h2>

//             <p className="text-gray-700">
//               ₹{product.price}
//             </p>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }


// import Image from "next/image";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
// };

// // 🔹 Helper to fix image path issues
// function getImageSrc(image?: string) {
//   if (!image) return "/placeholder.png";

//   // Absolute URL (Cloudinary, etc.)
//   if (image.startsWith("http")) {
//     return image;
//   }

//   // Relative image without leading slash (e.g. "test.jpg")
//   if (!image.startsWith("/")) {
//     return `/${image}`;
//   }

//   return image;
// }

// async function getProducts(): Promise<Product[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }

//   return res.json();
// }

// export default async function HomePage() {
//   const products = await getProducts();

//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold mb-6">ShopSphere</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <div
//             key={product._id}
//             className="border rounded-lg p-4 hover:shadow-lg transition"
//           >
//             <div className="relative h-40 w-full mb-3 bg-gray-100 rounded">
//               <Image
//                 src={getImageSrc(product.image)}
//                 alt={product.name}
//                 fill
//                 className="object-cover rounded"
//               />
//             </div>

//             <h2 className="text-lg font-semibold">
//               {product.name}
//             </h2>

//             <p className="text-gray-700">
//               ₹{product.price}
//             </p>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }


// import Image from "next/image";
// import Link from "next/link";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
// };

// // 🔹 Helper to fix image path issues
// function getImageSrc(image?: string) {
//   if (!image) return "/placeholder.png";

//   // Absolute URL (Cloudinary, S3, etc.)
//   if (image.startsWith("http")) {
//     return image;
//   }

//   // Relative image without leading slash (e.g. "test.jpg")
//   if (!image.startsWith("/")) {
//     return `/${image}`;
//   }

//   return image;
// }

// async function getProducts(): Promise<Product[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }

//   return res.json();
// }

// export default async function HomePage() {
//   const products = await getProducts();

//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold mb-6">
//         ShopSphere
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <Link
//             key={product._id}
//             href={`/product/${product._id}`}
//             className="block"
//           >
//             <div className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
//               <div className="relative h-40 w-full mb-3 bg-gray-100 rounded">
//                 <Image
//                   src={getImageSrc(product.image)}
//                   alt={product.name}
//                   fill
//                   className="object-cover rounded"
//                 />
//               </div>

//               <h2 className="text-lg font-semibold">
//                 {product.name}
//               </h2>

//               <p className="text-gray-700">
//                 ₹{product.price}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }

import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to ShopSphere. Discover products, shop with confidence, and track your orders. Your direct-to-consumer shopping destination.",
  openGraph: {
    title: "ShopSphere – Discover & Shop",
    description: "Discover products, track orders, fast delivery. Your D2C shopping destination.",
  },
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShopSphere",
  url: siteUrl,
  description: "Modern D2C e-commerce platform. Shop smarter, track orders, fast delivery.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?search={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
