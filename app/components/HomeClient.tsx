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

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ProductFilter from "./ProductFilter";
import WishlistButton from "./WishlistButton";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  brand?: string;
};

type FilterOptions = {
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  order: string;
};

function getImageSrc(image?: string) {
  // Use a working placeholder from Unsplash
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  if (!image.startsWith("/")) return placeholder;
  return image;
}

export default function HomeClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt",
    order: "desc",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialFetchRef = useRef(false);
  const filtersRef = useRef(filters);
  const searchQueryRef = useRef(searchQuery);

  // Keep refs in sync
  useEffect(() => {
    filtersRef.current = filters;
    searchQueryRef.current = searchQuery;
  }, [filters, searchQuery]);

  // Initialize login state
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const loggedIn = !!userInfo;
    setIsLoggedIn(loggedIn);

    if (!loggedIn) {
      setLoading(false);
    }
  }, []);

  // Fetch products function - uses refs to avoid dependency issues
  const fetchProducts = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      // Use refs to get current values
      const currentFilters = filtersRef.current;
      const currentSearch = searchQueryRef.current;
      
      // Build query string
      const params = new URLSearchParams();
      if (currentSearch) params.append("search", currentSearch);
      if (currentFilters.category) params.append("category", currentFilters.category);
      if (currentFilters.brand) params.append("brand", currentFilters.brand);
      if (currentFilters.minPrice) params.append("minPrice", currentFilters.minPrice);
      if (currentFilters.maxPrice) params.append("maxPrice", currentFilters.maxPrice);
      params.append("sort", currentFilters.sort);
      params.append("order", currentFilters.order);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`
      );
      
      if (!res.ok) {
        if (res.status === 429) {
          console.warn("Rate limited. Please wait before making more requests.");
          return;
        }
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Handle both old format (array) and new format (object with products)
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        if (data.filters) {
          setCategories(data.filters.categories || []);
          setBrands(data.filters.brands || []);
        }
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []); // No dependencies - uses refs instead

  // Fetch on initial login (only once)
  useEffect(() => {
    if (isLoggedIn && !hasInitialFetchRef.current && !isFetchingRef.current) {
      hasInitialFetchRef.current = true;
      fetchProducts();
    }
  }, [isLoggedIn, fetchProducts]);

  // Debounced fetch when filters/search change (only if already logged in)
  useEffect(() => {
    if (!isLoggedIn || !hasInitialFetchRef.current) return;

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the fetch by 500ms to prevent rate limiting
    debounceTimerRef.current = setTimeout(() => {
      if (!isFetchingRef.current) {
        fetchProducts();
      }
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.sort, filters.order, isLoggedIn, fetchProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
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
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to ShopSphere
        </h1>
        <p className="text-gray-400">
          Discover amazing products at great prices
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filters */}
      {(categories.length > 0 || brands.length > 0) && (
        <ProductFilter
          categories={categories}
          brands={brands}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">
            No products found
          </h2>
          <p className="text-gray-400 mb-6">
            {searchQuery || filters.category || filters.brand
              ? "Try adjusting your search or filters"
              : "Products will appear here once they are added to the store."}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-400">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border border-gray-700 rounded-lg p-3 sm:p-4 hover:border-green-500 hover:shadow-lg transition-all duration-200 bg-gray-900 relative group"
              >
                {/* Wishlist Heart Button */}
                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton
                    productId={product._id}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-gray-800 transition-colors"
                  />
                </div>

                <Link href={`/product/${product._id}`} className="block">
                  <div className="relative h-40 sm:h-48 w-full mb-3 sm:mb-4 bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={getImageSrc(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover rounded group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        // Fallback to working Unsplash placeholder
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("photo-1505740420928")) {
                          target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
                        }
                      }}
                      unoptimized={product.image?.includes("unsplash.com") || !product.image}
                    />
                  </div>

                  <h2 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                    {product.name}
                  </h2>

                  {product.brand && (
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">{product.brand}</p>
                  )}

                  <p className="text-lg sm:text-xl font-bold text-green-500">
                    ₹{product.price.toLocaleString()}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
