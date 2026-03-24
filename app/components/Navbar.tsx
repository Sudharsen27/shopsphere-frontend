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

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import MiniCartDrawer from "./MiniCartDrawer";
import NotificationDropdown from "./NotificationDropdown";

type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  orderId?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const { resolved, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const closeCart = useCallback(() => setCartOpen(false), []);

  const totalQty = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userInfo?.token) {
        setUnreadCount(0);
        return;
      }

      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiBase}/notifications`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          setUnreadCount(0);
          return;
        }

        const notifications: NotificationItem[] = await response.json();
        setNotifications(notifications);
        const unread = notifications.filter((item) => !item.isRead).length;
        setUnreadCount(unread);
      } catch {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, [userInfo]);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!userInfo?.token) return;

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${apiBase}/notifications/${notification._id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
    } catch {
      // Keep navigation working even if mark-read request fails.
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notification._id ? { ...item, isRead: true } : item
      )
    );
    setUnreadCount((prev) => (notification.isRead ? prev : Math.max(0, prev - 1)));
    setNotificationOpen(false);

    if (notification.orderId) {
      router.push(`/orders/${notification.orderId}`);
    } else {
      router.push("/orders");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--card-bg)] border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200">
            ShopSphere
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center rounded-lg border border-[var(--card-border)] p-0.5 mr-2">
              <button
                type="button"
                onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
                className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)]/30 transition-colors duration-200 active:scale-95"
                aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {resolved === "dark" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
            {!userInfo ? (
              <Link href="/login" className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 px-3 py-2 rounded-md active:scale-[0.98]">
                Login
              </Link>
            ) : (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationOpen((prev) => !prev)}
                    className="relative p-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 rounded-md active:scale-[0.98]"
                    aria-label="Notifications"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.389 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown
                    isOpen={notificationOpen}
                    notifications={notifications}
                    onNotificationClick={handleNotificationClick}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 px-3 py-2 rounded-md relative active:scale-[0.98]"
                >
                  Cart
                  {totalQty > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalQty}
                    </span>
                  )}
                </button>

                <Link href="/wishlist" className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 px-3 py-2 rounded-md active:scale-[0.98]">
                  Wishlist
                </Link>

                <Link href="/orders" className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 px-3 py-2 rounded-md active:scale-[0.98]">
                  Orders
                </Link>

                <Link href="/profile" className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 px-3 py-2 rounded-md active:scale-[0.98]">
                  Profile
                </Link>

                {userInfo.role === "admin" && (
                  <Link href="/admin" className="font-medium text-[var(--accent)] hover:opacity-90 transition-colors duration-200 px-3 py-2 rounded-md active:scale-[0.98]">
                    Admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="font-medium text-red-500 hover:text-red-600 transition-colors duration-200 px-3 py-2 rounded-md active:scale-[0.98]"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
              className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] rounded-md"
              aria-label="Toggle theme"
            >
              {resolved === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors p-2 rounded-md active:scale-95"
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--card-border)] py-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col space-y-2">
              {!userInfo ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors px-4 py-2 rounded"
                >
                  Login
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCartOpen(true);
                    }}
                    className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors px-4 py-2 rounded flex items-center justify-between"
                  >
                    <span>Cart</span>
                    {totalQty > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalQty}
                      </span>
                    )}
                  </button>

                  <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors px-4 py-2 rounded">
                    Wishlist
                  </Link>

                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors px-4 py-2 rounded">
                    My Orders
                  </Link>

                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors px-4 py-2 rounded">
                    Profile
                  </Link>

                  {userInfo.role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="font-medium text-[var(--accent)] hover:opacity-90 transition-colors px-4 py-2 rounded">
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
      <MiniCartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
}
