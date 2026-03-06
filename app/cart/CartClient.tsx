


// "use client";

// import { useCart } from "../context/CartContext";
// import { useHydrated } from "../hooks/useHydrated";
// import Link from "next/link";


// export default function CartClient() {
//   const hydrated = useHydrated();
//   const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

//   // 🚨 IMPORTANT: server + first client render are IDENTICAL
//   if (!hydrated) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-4">Cart</h1>
//         <p className="text-center text-gray-400 mt-10">
//           Loading cart…
//         </p>
//       </div>
//     );
//   }

//   const total = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Cart</h1>

//       {cartItems.length === 0 ? (
//         <div className="p-10 text-center">
//           <h2 className="text-xl font-semibold">
//             Your cart is empty 🛒
//           </h2>
//           <Link
//   href="/checkout"
//   className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold"
// >
//   Proceed to Checkout
// </Link>
//         </div>
//       ) : (
//         <>
//           {cartItems.map((item) => (
//             <div
//               key={item._id}
//               className="flex items-center justify-between border border-gray-600 p-4 rounded-md mb-4"
//             >
//               <div className="flex flex-col gap-2">
//                 <h3 className="text-lg font-semibold">{item.name}</h3>
//                 <p className="text-gray-400">₹{item.price}</p>

//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => decreaseQty(item._id)}
//                     className="px-3 py-1 border rounded"
//                   >
//                     −
//                   </button>

//                   <span className="font-medium">{item.qty}</span>

//                   <button
//                     onClick={() => increaseQty(item._id)}
//                     className="px-3 py-1 border rounded"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={() => removeFromCart(item._id)}
//                 className="text-red-500 hover:underline"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}

//           <h2 className="font-bold mt-6 text-right">
//             Total: ₹{total}
//           </h2>
//         </>
//       )}
//     </div>
//   );
// }


"use client";

import { useCart } from "../context/CartContext";
import { useHydrated } from "../hooks/useHydrated";
import Link from "next/link";
import EmptyState from "../components/EmptyState";
import Image from "next/image";
import { useToast } from "../context/ToastContext";

function getImageSrc(image?: string) {
  const placeholder =
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  if (!image) return placeholder;
  if (image.startsWith("http")) return image;
  return placeholder;
}

export default function CartClient() {
  const hydrated = useHydrated();
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();
  const toast = useToast();

  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Cart</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-lg bg-[var(--card-border)]/30" />
          <div className="h-24 rounded-lg bg-[var(--card-border)]/30" />
          <div className="h-24 rounded-lg bg-[var(--card-border)]/30" />
        </div>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--foreground)]">Cart</h1>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title="Your cart is empty"
          description="Add items from the shop to see them here."
          actionLabel="Start shopping"
          actionHref="/"
        />
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[var(--card-border)] p-4 rounded-lg mb-4 bg-[var(--card-bg)] transition-shadow hover:shadow-md"
            >
              <div className="flex gap-4 w-full">
                <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-[var(--card-border)] bg-[var(--card-border)]/20">
                  <Image
                    src={getImageSrc(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[var(--muted)] whitespace-nowrap">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-[var(--muted)] text-sm">
                    ₹{item.price.toLocaleString()} each
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-border)]/30 transition-colors active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span className="font-medium min-w-[1.5rem] text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--card-border)] bg-transparent hover:bg-[var(--card-border)]/30 transition-colors active:scale-95"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                    <button
                      onClick={() => {
                        removeFromCart(item._id);
                        toast.info("Removed from cart");
                      }}
                      className="ml-auto text-red-500 hover:text-red-600 text-sm font-medium transition-colors active:scale-[0.98]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Total: ₹{total.toLocaleString()}
            </h2>
            <Link
              href="/checkout"
              className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
