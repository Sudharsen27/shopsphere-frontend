// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
// };

// function getImageSrc(image?: string) {
//   if (!image) return "/placeholder.png";
//   if (image.startsWith("http")) return image;
//   if (!image.startsWith("/")) return `/${image}`;
//   return image;
// }

// export default function HomeClient() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const userInfo = localStorage.getItem("userInfo");
//     setIsLoggedIn(!!userInfo);

//     if (userInfo) {
//       fetchProducts();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/products`
//       );
//       const data = await res.json();
//       setProducts(data);
//     } catch (error) {
//       console.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔐 LANDING PAGE (Logged out)
//   if (!isLoggedIn && !loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
//         <h1 className="text-4xl font-bold mb-4">
//           Welcome to ShopSphere
//         </h1>
//         <p className="text-gray-400 mb-6">
//           Shop smarter. Track orders. Fast delivery.
//         </p>

//         <Link
//           href="/login"
//           className="bg-green-600 px-6 py-3 rounded text-white"
//         >
//           Login to continue
//         </Link>
//       </div>
//     );
//   }

//   // ⏳ Loading state
//   if (loading) {
//     return (
//       <p className="text-center mt-20">
//         Loading...
//       </p>
//     );
//   }

//   // 🛒 SHOP PAGE (Logged in)
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
//             <div className="border rounded-lg p-4 hover:shadow-lg transition">
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


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

function getImageSrc(image?: string) {
  if (!image) return "/placeholder.png";
  if (image.startsWith("http")) return image;
  if (!image.startsWith("/")) return `/${image}`;
  return image;
}

export default function HomeClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const loggedIn = !!userInfo;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🔐 LANDING PAGE (LOGGED OUT – PROFESSIONAL UI)
     ===================================================== */
  if (!isLoggedIn && !loading) {
    return (
      <section className="min-h-[80vh] flex items-center px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to ShopSphere
            </h1>

            <p className="text-gray-400 text-lg mb-8">
              A modern e-commerce platform to shop smarter, track orders,
              and enjoy fast, reliable delivery.
            </p>

            <Link
              href="/login"
              className="inline-block bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded text-white text-lg"
            >
              Login to continue
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-80 md:h-[420px]">
            <Image
              src="/logoshop.png"
              alt="ShopSphere Shopping"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     ⏳ LOADING STATE
     ===================================================== */
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-400">
        Loading...
      </p>
    );
  }

  /* =====================================================
     🛒 SHOP PAGE (LOGGED IN)
     ===================================================== */
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        ShopSphere
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product._id}`}
            className="block"
          >
            <div className="border rounded-lg p-4 hover:shadow-lg transition">
              <div className="relative h-40 w-full mb-3 bg-gray-100 rounded">
                <Image
                  src={getImageSrc(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <h2 className="text-lg font-semibold">
                {product.name}
              </h2>

              <p className="text-gray-700">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
