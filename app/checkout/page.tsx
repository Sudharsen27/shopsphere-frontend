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
import { authApi } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type SavedAddress = { _id: string; address: string; city: string; postalCode: string; country: string; isDefault?: boolean };
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Offer = { code: string; description: string };

function CheckoutOffers({ API_BASE }: { API_BASE: string }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/coupons/offers`)
      .then((r) => r.json())
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [API_BASE]);
  if (offers.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-gray-700/50">
      <p className="text-xs text-gray-400 mb-1">Current offers:</p>
      <ul className="text-xs text-gray-300 space-y-0.5">
        {offers.map((o) => (
          <li key={o.code}>
            <span className="font-mono font-semibold text-green-400">{o.code}</span> — {o.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online Payment">("COD");
  const [placing, setPlacing] = useState(false);
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved addresses when user is logged in
  useEffect(() => {
    if (!userInfo) return;
    authApi.getProfile().then((res: any) => {
      const list = res?.user?.addresses || [];
      setSavedAddresses(Array.isArray(list) ? list : []);
      const defaultAddr = list?.find((a: SavedAddress) => a.isDefault) || list?.[0];
      if (defaultAddr && !useNewAddress) {
        setSelectedAddressId(defaultAddr._id);
        setAddress(defaultAddr.address);
        setCity(defaultAddr.city);
        setPostalCode(defaultAddr.postalCode);
        setCountry(defaultAddr.country);
      }
    }).catch(() => {});
  }, [userInfo]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discountAmount);

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: data.couponCode, discountAmount: data.discountAmount });
      } else {
        setCouponError(data.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Could not validate coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

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
          itemsPrice: subtotal,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: total,
          ...(appliedCoupon && { couponCode: appliedCoupon.code }),
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
        const msg = data.message || "Order failed";
        alert(msg.includes("stock") || msg.includes("Stock") ? `${msg} Please update your cart and try again.` : msg);
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

        {savedAddresses.length > 0 && !useNewAddress && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Choose a saved address or add a new one</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {savedAddresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    selectedAddressId === addr._id ? "border-green-500 bg-green-500/10" : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    checked={selectedAddressId === addr._id}
                    onChange={() => {
                      setSelectedAddressId(addr._id);
                      setAddress(addr.address);
                      setCity(addr.city);
                      setPostalCode(addr.postalCode);
                      setCountry(addr.country);
                    }}
                    className="mt-1 w-4 h-4 text-green-600"
                  />
                  <div>
                    <span className="text-white">{addr.address}, {addr.city} {addr.postalCode}, {addr.country}</span>
                    {addr.isDefault && <span className="ml-2 text-xs text-green-400">Default</span>}
                  </div>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setUseNewAddress(true); setSelectedAddressId(null); setAddress(""); setCity(""); setPostalCode(""); setCountry(""); }}
              className="text-sm text-green-400 hover:underline"
            >
              + Add new address
            </button>
          </div>
        )}

        {(useNewAddress || savedAddresses.length === 0) && (
          <>
            {savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setUseNewAddress(false);
                const addr = savedAddresses.find((a) => a._id === selectedAddressId) || savedAddresses[0];
                if (addr) {
                  setSelectedAddressId(addr._id);
                  setAddress(addr.address);
                  setCity(addr.city);
                  setPostalCode(addr.postalCode);
                  setCountry(addr.country);
                }
              }}
              className="text-sm text-gray-400 hover:underline mb-2"
            >
              ← Choose saved address
            </button>
            )}
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border rounded bg-black text-white border-gray-700"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 border rounded bg-black text-white border-gray-700"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="w-full p-3 border rounded bg-black text-white border-gray-700"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full p-3 border rounded bg-black text-white border-gray-700"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </>
        )}
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
        <div className="py-3 border-b border-gray-700/50">
          <p className="text-xs text-gray-400 mb-2">
            Have a coupon? Type the code below (e.g. SAVE10, FLAT100) and click Apply.
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 min-w-[120px] p-2 border border-gray-600 rounded bg-black text-white text-sm"
              value={couponInput}
              onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
              disabled={!!appliedCoupon}
            />
            {appliedCoupon ? (
              <span className="text-green-400 text-sm font-medium">
                {appliedCoupon.code} (−₹{appliedCoupon.discountAmount.toLocaleString()})
              </span>
            ) : null}
            {appliedCoupon ? (
              <button type="button" onClick={removeCoupon} className="text-red-400 text-sm hover:underline">
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={applyCoupon}
                disabled={applyingCoupon || !couponInput.trim()}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium disabled:opacity-50"
              >
                {applyingCoupon ? "Applying..." : "Apply"}
              </button>
            )}
          </div>
          {couponError ? <p className="text-red-400 text-xs mt-1">{couponError}</p> : null}
          <CheckoutOffers API_BASE={API_BASE} />
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between py-2 text-green-400">
            <span>Discount</span>
            <span>−₹{discountAmount.toLocaleString()}</span>
          </div>
        )}
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
