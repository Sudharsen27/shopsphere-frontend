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

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();

  const totalQty = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold">
        ShopSphere
      </Link>

      <div className="flex items-center gap-6">
        {!userInfo ? (
          <Link href="/login" className="font-medium">
            Login
          </Link>
        ) : (
          <>
            <Link href="/cart" className="font-medium">
              Cart ({totalQty})
            </Link>

            <Link href="/orders" className="font-medium">
              My Orders
            </Link>

            <Link href="/profile" className="font-medium">
              Profile
            </Link>

            {userInfo.role === "admin" && (
              <Link href="/admin" className="font-medium text-green-400 hover:text-green-300">
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="font-medium text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
