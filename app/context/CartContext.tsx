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
//   // ✅ ONLY place we read localStorage
//   const [cartItems, setCartItems] = useState<CartItem[]>(() => {
//     if (typeof window === "undefined") return [];
//     const storedCart = localStorage.getItem("cart");
//     return storedCart ? JSON.parse(storedCart) : [];
//   });

//   // ✅ ONLY syncing state → localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

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
//   increaseQty: (id: string) => void;
//   decreaseQty: (id: string) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // ✅ ONLY place we read localStorage
//   const [cartItems, setCartItems] = useState<CartItem[]>(() => {
//     if (typeof window === "undefined") return [];
//     const storedCart = localStorage.getItem("cart");
//     return storedCart ? JSON.parse(storedCart) : [];
//   });

//   // ✅ ONLY syncing state → localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // ➕ ADD TO CART
//   const addToCart = (item: CartItem) => {
//     setCartItems((prev) => {
//       const existing = prev.find((p) => p._id === item._id);

//       if (existing) {
//         return prev.map((p) =>
//           p._id === item._id ? { ...p, qty: p.qty + 1 } : p
//         );
//       }

//       return [...prev, { ...item, qty: item.qty || 1 }];
//     });
//   };

//   // ➕ INCREASE QTY
//   const increaseQty = (id: string) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, qty: item.qty + 1 } : item
//       )
//     );
//   };

//   // ➖ DECREASE QTY
//   const decreaseQty = (id: string) => {
//     setCartItems((prev) =>
//       prev
//         .map((item) =>
//           item._id === id ? { ...item, qty: item.qty - 1 } : item
//         )
//         .filter((item) => item.qty > 0)
//     );
//   };

//   // ❌ REMOVE ITEM
//   const removeFromCart = (id: string) => {
//     setCartItems((prev) => prev.filter((item) => item._id !== id));
//   };

//   // 🧹 CLEAR CART (Checkout success)
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         increaseQty,
//         decreaseQty,
//         removeFromCart,
//         clearCart,
//       }}
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

// import { createContext, useContext, useEffect, useRef, useState } from "react";

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
//   increaseQty: (id: string) => void;
//   decreaseQty: (id: string) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   // Same initial render on server & client
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const hasMounted = useRef(false);

//   // ✅ Load from localStorage AFTER mount (once)
//   useEffect(() => {
//     const stored = localStorage.getItem("cart");
//     if (stored) {
//       try {
//         setCartItems(JSON.parse(stored));
//       } catch {
//         setCartItems([]);
//       }
//     }
//     hasMounted.current = true;
//   }, []);

//   // ✅ Sync to localStorage AFTER first mount
//   useEffect(() => {
//     if (!hasMounted.current) return;
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item: CartItem) => {
//     setCartItems((prev) => {
//       const existing = prev.find((p) => p._id === item._id);
//       if (existing) {
//         return prev.map((p) =>
//           p._id === item._id ? { ...p, qty: p.qty + 1 } : p
//         );
//       }
//       return [...prev, { ...item, qty: 1 }];
//     });
//   };

//   const increaseQty = (id: string) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, qty: item.qty + 1 } : item
//       )
//     );
//   };

//   const decreaseQty = (id: string) => {
//     setCartItems((prev) =>
//       prev
//         .map((item) =>
//           item._id === id ? { ...item, qty: item.qty - 1 } : item
//         )
//         .filter((item) => item.qty > 0)
//     );
//   };

//   const removeFromCart = (id: string) => {
//     setCartItems((prev) => prev.filter((item) => item._id !== id));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         increaseQty,
//         decreaseQty,
//         removeFromCart,
//         clearCart,
//       }}
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
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ✅ Read localStorage ONLY once (lazy init)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ✅ Sync changes to localStorage (NO warning)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p._id === item._id);
      if (existing) {
        return prev.map((p) =>
          p._id === item._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  /** Clears cart only. Does NOT touch userInfo or any other localStorage keys. */
  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", "[]");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
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
