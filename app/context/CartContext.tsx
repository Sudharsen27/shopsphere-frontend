// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type CartItem = {
//   product: string;
//   name: string;
//   price: number;
//   image?: string;
//   qty: number;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (productId: string) => void;
//   clearCart: () => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>(() => {
//     const storedCart = localStorage.getItem("cart");
//     return storedCart ? JSON.parse(storedCart) : [];
//   });

//   // Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item: CartItem) => {
//     setCartItems((prev) => {
//       const existing = prev.find((x) => x.product === item.product);

//       if (existing) {
//         return prev.map((x) =>
//           x.product === item.product
//             ? { ...x, qty: x.qty + item.qty }
//             : x
//         );
//       }

//       return [...prev, item];
//     });
//   };

//   const removeFromCart = (productId: string) => {
//     setCartItems((prev) =>
//       prev.filter((item) => item.product !== productId)
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// }


// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// type CartItem = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   qty: number;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // ✅ Load cart from localStorage (CLIENT ONLY)
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, []);

//   // ✅ Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item: CartItem) => {
//     setCartItems((prev) => {
//       const exist = prev.find((x) => x._id === item._id);

//       if (exist) {
//         return prev.map((x) =>
//           x._id === item._id
//             ? { ...x, qty: x.qty + item.qty }
//             : x
//         );
//       }

//       return [...prev, item];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCartItems((prev) =>
//       prev.filter((item) => item._id !== id)
//     );
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used inside CartProvider");
//   }
//   return context;
// }

// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type CartItem = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   qty: number;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // ✅ Lazy initialization (NO effect needed)
//   const [cartItems, setCartItems] = useState<CartItem[]>(() => {
//     if (typeof window === "undefined") return [];
//     const storedCart = localStorage.getItem("cart");
//     return storedCart ? JSON.parse(storedCart) : [];
//   });

//   // ✅ Sync cart → localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item: CartItem) => {
//     setCartItems((prev) => {
//       const exist = prev.find((x) => x._id === item._id);

//       if (exist) {
//         return prev.map((x) =>
//           x._id === item._id ? { ...x, qty: x.qty + item.qty } : x
//         );
//       }

//       return [...prev, item];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCartItems((prev) => prev.filter((item) => item._id !== id));
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used inside CartProvider");
//   }
//   return context;
// }


// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// export type CartItem = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   qty: number;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // ✅ Load cart from localStorage (client-only)
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, []);

//   // ✅ Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item: CartItem) => {
//     setCartItems((prev) => {
//       const exist = prev.find((x) => x._id === item._id);

//       if (exist) {
//         return prev.map((x) =>
//           x._id === item._id
//             ? { ...x, qty: x.qty + 1 }
//             : x
//         );
//       }

//       return [...prev, { ...item, qty: 1 }];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCartItems((prev) =>
//       prev.filter((item) => item._id !== id)
//     );
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// }


// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// type CartItem = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   qty: number;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
// };

// const CartContext = createContext<CartContextType | undefined>(
//   undefined
// );

// export function CartProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // ✅ Load cart from localStorage ONCE
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, []);

//   // ✅ Save cart to localStorage when it changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // ✅ Add to cart logic
//   const addToCart = (item: CartItem) => {
//     setCartItems((prev) => {
//       const existing = prev.find(
//         (p) => p._id === item._id
//       );

//       if (existing) {
//         return prev.map((p) =>
//           p._id === item._id
//             ? { ...p, qty: p.qty + 1 }
//             : p
//         );
//       }

//       return [...prev, item];
//     });
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// }

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ ONLY place we read localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // ✅ ONLY syncing state → localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (p) => p._id === item._id
      );

      if (existing) {
        return prev.map((p) =>
          p._id === item._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, item];
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
