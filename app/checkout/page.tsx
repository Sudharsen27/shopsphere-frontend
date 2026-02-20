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
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online Payment">("COD");
  const [placing, setPlacing] = useState(false);
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Load Razorpay script
  useEffect(() => {
    if (paymentMethod === "Online Payment" && !window.Razorpay) {
      setLoadingRazorpay(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        setLoadingRazorpay(false);
      };
      script.onerror = () => {
        setLoadingRazorpay(false);
        alert("Failed to load payment gateway. Please try again.");
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod]);

  const handleOnlinePayment = async (orderId: string) => {
    if (!window.Razorpay) {
      alert("Payment gateway not loaded. Please refresh and try again.");
      return;
    }

    try {
      // Create Razorpay order
      const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({
          orderId,
          amount: total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create payment order");
      }

      // Initialize Razorpay checkout
      const options = {
        key: data.keyId || RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "ShopSphere",
        description: `Order #${orderId.slice(-8)}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment on backend
          try {
            const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo?.token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/payment/success?orderId=${orderId}`);
            } else {
              router.push(`/payment/failure?orderId=${orderId}&reason=${encodeURIComponent(verifyData.message || "Payment verification failed")}`);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            router.push(`/payment/failure?orderId=${orderId}&reason=${encodeURIComponent("Payment verification failed")}`);
          }
        },
        prefill: {
          name: userInfo?.name || "",
          email: userInfo?.email || "",
        },
        theme: {
          color: "#10b981", // Green color matching your theme
        },
        modal: {
          ondismiss: function () {
            // User closed the payment modal
            router.push(`/payment/failure?orderId=${orderId}&reason=${encodeURIComponent("Payment cancelled by user")}`);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.");
    }
  };

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
          paymentMethod: paymentMethod,
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

      const orderId = data._id || data.id;

      if (paymentMethod === "Online Payment") {
        // Handle online payment
        setPlacing(false);
        await handleOnlinePayment(orderId);
      } else {
        // COD - order placed successfully
        clearCart();
        alert("Order placed successfully 🥳");
        router.replace("/orders");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

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

      {/* 💳 PAYMENT METHOD */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex items-center p-4 border border-gray-700 rounded-lg bg-gray-900 cursor-pointer hover:border-green-500 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value as "COD" | "Online Payment")}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <div className="ml-3 flex-1">
              <span className="font-medium text-white">Cash on Delivery (COD)</span>
              <p className="text-sm text-gray-400">Pay when you receive the order</p>
            </div>
          </label>

          <label className="flex items-center p-4 border border-gray-700 rounded-lg bg-gray-900 cursor-pointer hover:border-green-500 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="Online Payment"
              checked={paymentMethod === "Online Payment"}
              onChange={(e) => setPaymentMethod(e.target.value as "COD" | "Online Payment")}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <div className="ml-3 flex-1">
              <span className="font-medium text-white">Online Payment</span>
              <p className="text-sm text-gray-400">Pay securely with Razorpay (Cards, UPI, Net Banking)</p>
            </div>
          </label>
        </div>
      </div>

      {/* 🛒 ORDER SUMMARY */}
      <div className="mb-6 border border-gray-700 rounded-lg p-4 sm:p-6 bg-gray-900/50">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">
          {cartItems.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              className="flex justify-between py-2 sm:py-3 border-b border-gray-700/50 text-sm sm:text-base"
            >
              <span className="text-gray-300">
                {item.name} × {item.qty}
              </span>
              <span className="font-medium text-white">₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg sm:text-xl pt-4 border-t border-gray-700">
          <span className="text-white">Total</span>
          <span className="text-green-400">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={placeOrder}
        disabled={placing || (paymentMethod === "Online Payment" && loadingRazorpay)}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition py-3 sm:py-4 rounded-lg font-medium text-white text-base sm:text-lg"
      >
        {placing
          ? "Placing order..."
          : paymentMethod === "Online Payment" && loadingRazorpay
          ? "Loading payment gateway..."
          : paymentMethod === "Online Payment"
          ? "Proceed to Payment"
          : "Place Order"}
      </button>
    </div>
  );
}
