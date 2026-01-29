// "use client";

// import { createContext, useContext, useState } from "react";

// type UserInfo = {
//   _id: string;
//   email: string;
//   token: string;
// };

// type AuthContextType = {
//   userInfo: UserInfo | null;
//   login: (user: UserInfo) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
//     const stored = localStorage.getItem("userInfo");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const login = (user: UserInfo) => {
//     localStorage.setItem("userInfo", JSON.stringify(user));
//     setUserInfo(user); // 🔥 this triggers Navbar update
//   };

//   const logout = () => {
//     localStorage.removeItem("userInfo");
//     setUserInfo(null);
//   };

//   return (
//     <AuthContext.Provider value={{ userInfo, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }
//   return ctx;
// }


// "use client";

// import { createContext, useContext, useState } from "react";

// type UserInfo = {
//   _id: string;
//   email: string;
//   token: string;
// };

// type AuthContextType = {
//   userInfo: UserInfo | null;
//   login: (user: UserInfo) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
//     if (typeof window === "undefined") return null; // ✅ SSR safe
//     const stored = localStorage.getItem("userInfo");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const login = (user: UserInfo) => {
//     localStorage.setItem("userInfo", JSON.stringify(user));
//     setUserInfo(user);
//   };

//   const logout = () => {
//     localStorage.removeItem("userInfo");
//     setUserInfo(null);
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider value={{ userInfo, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return ctx;
// }

// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type UserInfo = {
//   _id: string;
//   email: string;
//   token: string;
// };

// type AuthContextType = {
//   userInfo: UserInfo | null;
//   login: (user: UserInfo) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

//   // ✅ Load once on app start
//   useEffect(() => {
//     const stored = localStorage.getItem("userInfo");
//     if (stored) {
//       setUserInfo(JSON.parse(stored));
//     }
//   }, []);

//   const login = (user: UserInfo) => {
//     localStorage.setItem("userInfo", JSON.stringify(user));
//     setUserInfo(user);
//   };

//   const logout = () => {
//     localStorage.removeItem("userInfo");
//     localStorage.removeItem("cart"); // ✅ IMPORTANT
//     setUserInfo(null);
//     window.location.replace("/login"); // hard reset
//   };

//   return (
//     <AuthContext.Provider value={{ userInfo, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
    

// "use client";

// import { createContext, useContext, useState } from "react";

// type UserInfo = {
//   _id: string;
//   email: string;
//   token: string;
// };

// type AuthContextType = {
//   userInfo: UserInfo | null;
//   login: (user: UserInfo) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   // ✅ Lazy initialization (NO useEffect)
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
//     if (typeof window === "undefined") return null;
//     const stored = localStorage.getItem("userInfo");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const login = (user: UserInfo) => {
//     localStorage.setItem("userInfo", JSON.stringify(user));
//     setUserInfo(user);
//   };

//   const logout = () => {
//     localStorage.removeItem("userInfo");
//     localStorage.removeItem("cart"); // ✅ clear cart per user
//     setUserInfo(null);
//     window.location.replace("/login"); // hard reset
//   };

//   return (
//     <AuthContext.Provider value={{ userInfo, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return ctx;
// }


"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authApi, ApiError } from "@/lib/api";

type UserInfo = {
  _id: string;
  id?: string;
  name?: string;
  email: string;
  role?: string;
  token: string;
};

type AuthContextType = {
  userInfo: UserInfo | null;
  loading: boolean;
  login: (user: UserInfo) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
          const parsedUser = JSON.parse(stored);
          
          // Verify token is still valid
          try {
            const verified = await authApi.verifyToken();
            // Token is valid, use stored user info
            setUserInfo({
              ...parsedUser,
              id: parsedUser.id || parsedUser._id,
            });
          } catch (error) {
            // Token invalid or expired, clear storage
            localStorage.removeItem("userInfo");
            setUserInfo(null);
          }
        }
      } catch (error) {
        // Invalid JSON or other error, clear storage
        localStorage.removeItem("userInfo");
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (user: UserInfo) => {
    const userToStore = {
      ...user,
      id: user.id || user._id,
    };
    localStorage.setItem("userInfo", JSON.stringify(userToStore));
    setUserInfo(userToStore);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart"); // Clear cart on logout
    setUserInfo(null);
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        login,
        logout,
        isAuthenticated: !!userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
