// "use client";

// import { useRouter } from "next/navigation";
// import { useCart } from "../context/CartContext";

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const router = useRouter();

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//  const placeOrder = async () => {
//   if (cartItems.length === 0) return;

//   try {
//     const res = await fetch("http://localhost:5000/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         orderItems: cartItems.map((item) => ({
//           product: item._id,
//           name: item.name,
//           price: item.price,
//           qty: item.qty,
//         })),
//         paymentMethod: "COD",
//         itemsPrice: total,
//         taxPrice: 0,
//         shippingPrice: 0,
//         totalPrice: total,
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Order failed");
//     }

//     alert("Order placed successfully 🎉");
//     clearCart();
//     router.push("/");
//   } catch (err) {
//     alert("Order failed ❌");   
//   }
// };


//   if (cartItems.length === 0) {
//     return (
//       <div className="p-10 text-center">
//         <h2 className="text-xl font-semibold">
//           No items to checkout 🛒
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//       {cartItems.map((item) => (
//         <div
//           key={item._id}
//           className="flex justify-between border-b border-gray-700 py-3"
//         >
//           <span>
//             {item.name} × {item.qty}
//           </span>
//           <span>₹{item.price * item.qty}</span>
//         </div>
//       ))}

//       <div className="flex justify-between font-bold text-lg mt-6">
//         <span>Total</span>
//         <span>₹{total}</span>
//       </div>

//       <button
//         onClick={placeOrder}
//         className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import { useCart } from "../context/CartContext";

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const router = useRouter();

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   const placeOrder = async () => {
//     if (cartItems.length === 0) return;

//     // ✅ GET TOKEN FROM LOCAL STORAGE
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to place an order");
//       router.push("/login");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // ✅ REQUIRED
//         },
//         body: JSON.stringify({
//           orderItems: cartItems.map((item) => ({
//             product: item._id,
//             name: item.name,
//             price: item.price,
//             qty: item.qty,
//           })),
//           paymentMethod: "COD",
//           itemsPrice: total,
//           taxPrice: 0,
//           shippingPrice: 0,
//           totalPrice: total,
//         }),
//       });

//       if (res.status === 401) {
//         alert("Session expired. Please login again.");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) {
//         throw new Error("Order failed");
//       }

//       alert("Order placed successfully 🎉");
//       clearCart();
//       router.push("/");
//     } catch (err) {
//       alert("Order failed ❌");
//     }
    
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="p-10 text-center">
//         <h2 className="text-xl font-semibold">
//           No items to checkout 🛒
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//       {cartItems.map((item) => (
//         <div
//           key={item._id}
//           className="flex justify-between border-b border-gray-700 py-3"
//         >
//           <span>
//             {item.name} × {item.qty}
//           </span>
//           <span>₹{item.price * item.qty}</span>
//         </div>
//       ))}

//       <div className="flex justify-between font-bold text-lg mt-6">
//         <span>Total</span>
//         <span>₹{total}</span>
//       </div>

//       <button
//         onClick={placeOrder}
//         className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import { useCart } from "../context/CartContext";

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const router = useRouter();

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   const placeOrder = async () => {
//     if (cartItems.length === 0) return;

//     // ✅ GET TOKEN
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to place an order");
//       router.push("/login");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // ✅ REQUIRED
//         },
//         body: JSON.stringify({
//           orderItems: cartItems.map((item) => ({
//             product: item._id,
//             name: item.name,
//             price: item.price,
//             qty: item.qty,
//           })),
//           paymentMethod: "COD",
//           itemsPrice: total,
//           taxPrice: 0,
//           shippingPrice: 0,
//           totalPrice: total,
//         }),
//       });

//       if (res.status === 401) {
//         alert("Session expired. Please login again.");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) {
//         throw new Error("Order failed");
//       }

//       alert("Order placed successfully 🎉");
//       clearCart();
//       router.push("/");
//     } catch (error) {
//       alert("Order failed ❌");
//     }
//   };

//   // ✅ Empty cart state
//   if (cartItems.length === 0) {
//     return (
//       <div className="p-10 text-center">
//         <h2 className="text-xl font-semibold">
//           No items to checkout 🛒
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//       {cartItems.map((item) => (
//         <div
//           key={item._id}
//           className="flex justify-between border-b border-gray-700 py-3"
//         >
//           <span>
//             {item.name} × {item.qty}
//           </span>
//           <span>₹{item.price * item.qty}</span>
//         </div>
//       ))}

//       <div className="flex justify-between font-bold text-lg mt-6">
//         <span>Total</span>
//         <span>₹{total}</span>
//       </div>

//       <button
//         onClick={placeOrder}
//         className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import { useCart } from "../context/CartContext";

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const router = useRouter();

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   // ✅ ADD placeOrder HERE
//   const placeOrder = async () => {
//     if (cartItems.length === 0) return;

//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to place an order");
//       router.push("/login");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           orderItems: cartItems.map((item) => ({
//             product: item._id,
//             name: item.name,
//             price: item.price,
//             qty: item.qty,
//           })),
//           paymentMethod: "COD",
//           itemsPrice: total,
//           taxPrice: 0,
//           shippingPrice: 0,
//           totalPrice: total,
//         }),
//       });

//       if (res.status === 401) {
//         alert("Session expired. Please login again.");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) {
//         throw new Error("Order failed");
//       }

//       alert("Order placed successfully 🎉");
//       clearCart();
//       router.push("/");
//     } catch (err) {
//       alert("Order failed ❌");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//       {cartItems.map((item) => (
//         <div key={item._id} className="flex justify-between py-3">
//           <span>{item.name} × {item.qty}</span>
//           <span>₹{item.price * item.qty}</span>
//         </div>
//       ))}

//       <div className="flex justify-between font-bold mt-6">
//         <span>Total</span>
//         <span>₹{total}</span>
//       </div>

//       <button
//         onClick={placeOrder}
//         className="mt-6 w-full bg-green-600 py-3 rounded-md"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import { useCart } from "../context/CartContext";

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const router = useRouter();

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   const placeOrder = async () => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to place an order");
//       router.push("/login");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           orderItems: cartItems.map((item) => ({
//             name: item.name,
//             qty: item.qty,
//             image: item.image || "",
//             price: item.price,
//             product: item._id,
//           })),
//           paymentMethod: "COD",
//           itemsPrice: total,
//           taxPrice: 0,
//           shippingPrice: 0,
//           totalPrice: total,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         console.error("Order error:", data);
//         alert(data.message || "Order failed");
//         return;
//       }

//       alert("Order placed successfully 🎉");
//       clearCart();
//       router.push("/orders");
//     } catch (error) {
//       console.error("Order request failed:", error);
//       alert("Order failed ❌");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//       {cartItems.map((item) => (
//         <div
//           key={item._id}
//           className="flex justify-between items-center py-3 border-b"
//         >
//           <span>
//             {item.name} × {item.qty}
//           </span>
//           <span>₹{item.price * item.qty}</span>
//         </div>
//       ))}

//       <div className="flex justify-between font-bold mt-6 text-lg">
//         <span>Total</span>
//         <span>₹{total}</span>
//       </div>

//       <button
//         onClick={placeOrder}
//         className="mt-6 w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-md font-medium text-white"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useRouter } from "next/navigation";
// import { useCart } from "../context/CartContext";
// import { useState } from "react";

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const router = useRouter();

//   // ✅ Shipping Address State
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [country, setCountry] = useState("");

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   const placeOrder = async () => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty");
//       return;
//     }

//     if (!address || !city || !postalCode || !country) {
//       alert("Please fill all shipping details");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login to place an order");
//       router.push("/login");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           orderItems: cartItems.map((item) => ({
//             product: item._id,
//             name: item.name,
//             qty: item.qty,
//             price: item.price,
//             image: item.image || "",
//           })),
//           shippingAddress: {
//             address,
//             city,
//             postalCode,
//             country,
//           },
//           paymentMethod: "COD",
//           itemsPrice: total,
//           taxPrice: 0,
//           shippingPrice: 0,
//           totalPrice: total,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Order failed");
//         return;
//       }

//       alert("Order placed successfully 🎉");
//       clearCart();
//       router.push("/orders");
//     } catch (error) {
//       console.error(error);
//       alert("Order failed ❌");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//       {/* 🏠 SHIPPING ADDRESS */}
//       <div className="mb-8 space-y-4">
//         <h2 className="text-lg font-semibold">Shipping Address</h2>

//         <input
//           type="text"
//           placeholder="Address"
//           className="w-full p-3 border rounded bg-black text-white"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//         />

//         <input
//           type="text"
//           placeholder="City"
//           className="w-full p-3 border rounded bg-black text-white"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//         />

//         <input
//           type="text"
//           placeholder="Postal Code"
//           className="w-full p-3 border rounded bg-black text-white"
//           value={postalCode}
//           onChange={(e) => setPostalCode(e.target.value)}
//         />

//         <input
//           type="text"
//           placeholder="Country"
//           className="w-full p-3 border rounded bg-black text-white"
//           value={country}
//           onChange={(e) => setCountry(e.target.value)}
//         />
//       </div>

//       {/* 🛒 ORDER SUMMARY */}
//       <div className="mb-6">
//         {cartItems.map((item) => (
//           <div
//             key={item._id}
//             className="flex justify-between py-3 border-b"
//           >
//             <span>
//               {item.name} × {item.qty}
//             </span>
//             <span>₹{item.price * item.qty}</span>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-between font-bold text-lg mb-6">
//         <span>Total</span>
//         <span>₹{total}</span>
//       </div>

//       <button
//         onClick={placeOrder}
//         className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-md font-medium text-white"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }


"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [placing, setPlacing] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (!userInfo) {
      alert("Please login to place an order");
      router.replace("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!address.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      alert("Please fill all shipping details");
      return;
    }

    setPlacing(true);

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map((item) => ({
            product: item._id,
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.image || "",
          })),
          shippingAddress: {
            address: address.trim(),
            city: city.trim(),
            postalCode: postalCode.trim(),
            country: country.trim(),
          },
          paymentMethod: "COD",
          itemsPrice: total,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: total,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        router.replace("/login");
        setPlacing(false);
        return;
      }

      if (!res.ok) {
        alert(data.message || "Order failed");
        setPlacing(false);
        return;
      }

      clearCart();
      alert("Order placed successfully 🥳");
      router.replace("/orders");
    } catch (error) {
      console.error("Order error:", error);
      alert("Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* 🏠 SHIPPING ADDRESS */}
      <div className="mb-8 space-y-4">
        <h2 className="text-lg font-semibold">Shipping Address</h2>

        <input
          type="text"
          placeholder="Address"
          className="w-full p-3 border rounded bg-black text-white"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="w-full p-3 border rounded bg-black text-white"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Postal Code"
          className="w-full p-3 border rounded bg-black text-white"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <input
          type="text"
          placeholder="Country"
          className="w-full p-3 border rounded bg-black text-white"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      {/* 🛒 ORDER SUMMARY */}
      <div className="mb-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between py-3 border-b"
          >
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold text-lg mb-6">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={placeOrder}
        disabled={placing}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition py-3 rounded-md font-medium text-white"
      >
        {placing ? "Placing order..." : "Place Order"}
      </button>
    </div>
  );
}
