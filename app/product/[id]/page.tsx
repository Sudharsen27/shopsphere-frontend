// import Image from "next/image";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   description?: string;
// };

// async function getProduct(id: string): Promise<Product> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   return res.json();
// }

// export default async function ProductPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const product = await getProduct(params.id);

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <div className="grid md:grid-cols-2 gap-8">
//         <div className="relative h-80 bg-gray-100 rounded">
//           <Image
//             src={product.image || "/placeholder.png"}
//             alt={product.name}
//             fill
//             className="object-cover rounded"
//           />
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-4">
//             {product.name}
//           </h1>

//           <p className="text-xl text-green-600 mb-4">
//             ₹{product.price}
//           </p>

//           <p className="text-gray-600 mb-6">
//             {product.description || "No description available"}
//           </p>

//           <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
//             Add to Cart
//           </button>
//         </div>
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
//   description?: string;
// };

// // 🔹 Fix image paths
// function getImageSrc(image?: string) {
//   if (!image) return "/placeholder.png";
//   if (image.startsWith("http")) return image;
//   if (!image.startsWith("/")) return `/${image}`;
//   return image;
// }

// // 🔹 Fetch single product
// async function getProduct(id: string): Promise<Product> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   return res.json();
// }

// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ IMPORTANT FIX (Next.js 16)
//   const { id } = await params;

//   const product = await getProduct(id);

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative h-80 bg-gray-100 rounded">
//           <Image
//             src={getImageSrc(product.image)}
//             alt={product.name}
//             fill
//             className="object-cover rounded"
//           />
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-4">
//             {product.name}
//           </h1>

//           <p className="text-xl text-green-600 mb-4">
//             ₹{product.price}
//           </p>

//           {product.description && (
//             <p className="text-gray-700 mb-6">
//               {product.description}
//             </p>
//           )}

//           <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
//             Add to Cart
//           </button>
//         </div>
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
//   description?: string;
// };

// // 🔹 Fix image paths
// function getImageSrc(image?: string) {
//   if (!image) return "/placeholder.png";
//   if (image.startsWith("http")) return image;
//   if (!image.startsWith("/")) return `/${image}`;
//   return image;
// }

// // 🔹 Fetch single product
// async function getProduct(id: string): Promise<Product> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch product");
//   }

//   return res.json();
// }

// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ IMPORTANT FIX (Next.js 16)
//   const { id } = await params;

//   const product = await getProduct(id);

//   return (
//     <main className="p-6 max-w-4xl mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="relative h-80 bg-gray-100 rounded">
//           <Image
//             src={getImageSrc(product.image)}
//             alt={product.name}
//             fill
//             className="object-cover rounded"
//           />
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-4">
//             {product.name}
//           </h1>

//           <p className="text-xl text-green-600 mb-4">
//             ₹{product.price}
//           </p>

//           {product.description && (
//             <p className="text-gray-700 mb-6">
//               {product.description}
//             </p>
//           )}

//           <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }


import Image from "next/image";
import AddToCartButton from "@/app/components/AddToCartButton";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

// 🔹 Fix image paths
function getImageSrc(image?: string) {
  if (!image) return "/placeholder.png";
  if (image.startsWith("http")) return image;
  if (!image.startsWith("/")) return `/${image}`;
  return image;
}

// 🔹 Fetch single product
async function getProduct(id: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-80 bg-gray-100 rounded">
          <Image
            src={getImageSrc(product.image)}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-xl text-green-600 mb-4">
            ₹{product.price}
          </p>

          {product.description && (
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
          )}

          {/* ✅ CART BUTTON */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
