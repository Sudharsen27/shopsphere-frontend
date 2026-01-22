"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = () => {
    if (cartItems.length === 0) return;

    // TEMP: simulate order success
    alert("Order placed successfully 🎉");

    clearCart();
    router.push("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">
          No items to checkout 🛒
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex justify-between border-b border-gray-700 py-3"
        >
          <span>
            {item.name} × {item.qty}
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <div className="flex justify-between font-bold text-lg mt-6">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={placeOrder}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold"
      >
        Place Order
      </button>
    </div>
  );
}
