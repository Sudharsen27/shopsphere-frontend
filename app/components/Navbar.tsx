// "use client";

// import Link from "next/link";
// import { useCart } from "../context/CartContext";
// import { useState } from "react";

// type UserInfo = {
//   _id: string;
//   email: string;
//   token: string;
// };

// export default function Navbar() {
//   const { cartItems } = useCart();

//   // ✅ Lazy initialization (industry best practice)
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
//     if (typeof window === "undefined") return null;
//     const user = localStorage.getItem("userInfo");
//     return user ? JSON.parse(user) : null;
//   });

//   const totalQty = cartItems.reduce(
//     (total, item) => total + item.qty,
//     0
//   );

//   const logoutHandler = () => {
//     localStorage.removeItem("userInfo");
//     setUserInfo(null);
//     window.location.href = "/login";
//   };

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 border-b">
//       <Link href="/" className="text-xl font-bold">
//         ShopSphere
//       </Link>

//       <div className="flex items-center gap-6">
//         {!userInfo ? (
//           // 🔴 LOGGED OUT
//           <Link href="/login" className="font-medium">
//             Login
//           </Link>
//         ) : (
//           // 🟢 LOGGED IN
//           <>
//             <Link href="/cart" className="font-medium">
//               Cart ({totalQty})
//             </Link>

//             <Link href="/orders" className="font-medium">
//               My Orders
//             </Link>

//             <button
//               onClick={logoutHandler}
//               className="font-medium text-red-500"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useCart } from "../context/CartContext";
// import { useState } from "react";

// type UserInfo = {
//   _id: string;
//   email: string;
//   token: string;
// };

// export default function Navbar() {
//   const { cartItems } = useCart();

//   // ✅ Lazy init – NO useEffect
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
//     if (typeof window === "undefined") return null;
//     const user = localStorage.getItem("userInfo");
//     return user ? JSON.parse(user) : null;
//   });

//   const totalQty = cartItems.reduce(
//     (total, item) => total + item.qty,
//     0
//   );

//   const logoutHandler = () => {
//     localStorage.removeItem("userInfo");
//     setUserInfo(null);
//     window.location.href = "/login";
//   };

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 border-b">
//       <Link href="/" className="text-xl font-bold">
//         ShopSphere
//       </Link>

//       <div className="flex items-center gap-6">
//         {!userInfo ? (
//           <Link href="/login" className="font-medium">
//             Login
//           </Link>
//         ) : (
//           <>
//             <Link href="/cart" className="font-medium">
//               Cart ({totalQty})
//             </Link>

//             <Link href="/orders" className="font-medium">
//               My Orders
//             </Link>

//             <button
//               onClick={logoutHandler}
//               className="font-medium text-red-500"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { cartItems } = useCart();
//   const { userInfo, logout } = useAuth();

//   const totalQty = cartItems.reduce(
//     (total, item) => total + item.qty,
//     0
//   );

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 border-b">
//       <Link href="/" className="text-xl font-bold">
//         ShopSphere
//       </Link>

//       <div className="flex items-center gap-6">
//         {!userInfo ? (
//           <Link href="/login" className="font-medium">
//             Login
//           </Link>
//         ) : (
//           <>
//             <Link href="/cart" className="font-medium">
//               Cart ({totalQty})
//             </Link>

//             <Link href="/orders" className="font-medium">
//               My Orders
//             </Link>

//             <button
//               onClick={logout}
//               className="font-medium text-red-500"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const router = useRouter();
//   const { cartItems } = useCart();
//   const { userInfo, logout } = useAuth();

//   const totalQty = cartItems.reduce(
//     (total, item) => total + item.qty,
//     0
//   );

  
//   const handleLogout = () => {
//     logout();              // clear auth context + localStorage
//     router.push("/"); // redirect after logout
//   };

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 border-b">
//       <Link href="/" className="text-xl font-bold">
//         ShopSphere
//       </Link>

//       <div className="flex items-center gap-6">
//         {!userInfo ? (
//           <Link href="/login" className="font-medium">
//             Login
//           </Link>
//         ) : (
//           <>
//             <Link href="/cart" className="font-medium">
//               Cart ({totalQty})
//             </Link>

//             <Link href="/orders" className="font-medium">
//               My Orders
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="font-medium text-red-500 hover:text-red-600"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalQty = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-white hover:text-green-400 transition-colors">
            ShopSphere
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {!userInfo ? (
              <Link href="/login" className="font-medium text-white hover:text-green-400 transition-colors px-3 py-2">
                Login
              </Link>
            ) : (
              <>
                <Link href="/cart" className="font-medium text-white hover:text-green-400 transition-colors px-3 py-2 relative">
                  Cart
                  {totalQty > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalQty}
                    </span>
                  )}
                </Link>

                <Link href="/wishlist" className="font-medium text-white hover:text-green-400 transition-colors px-3 py-2">
                  Wishlist
                </Link>

                <Link href="/orders" className="font-medium text-white hover:text-green-400 transition-colors px-3 py-2">
                  Orders
                </Link>

                <Link href="/profile" className="font-medium text-white hover:text-green-400 transition-colors px-3 py-2">
                  Profile
                </Link>

                {userInfo.role === "admin" && (
                  <Link href="/admin" className="font-medium text-green-400 hover:text-green-300 transition-colors px-3 py-2">
                    Admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-green-400 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-2">
              {!userInfo ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium text-white hover:text-green-400 transition-colors px-4 py-2 rounded"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium text-white hover:text-green-400 transition-colors px-4 py-2 rounded flex items-center justify-between"
                  >
                    <span>Cart</span>
                    {totalQty > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalQty}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium text-white hover:text-green-400 transition-colors px-4 py-2 rounded"
                  >
                    Wishlist
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium text-white hover:text-green-400 transition-colors px-4 py-2 rounded"
                  >
                    My Orders
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium text-white hover:text-green-400 transition-colors px-4 py-2 rounded"
                  >
                    Profile
                  </Link>

                  {userInfo.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-medium text-green-400 hover:text-green-300 transition-colors px-4 py-2 rounded"
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="font-medium text-red-500 hover:text-red-600 transition-colors px-4 py-2 rounded text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
