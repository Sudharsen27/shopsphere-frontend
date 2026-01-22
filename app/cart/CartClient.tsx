


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

export default function CartClient() {
  const hydrated = useHydrated();
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        <p className="text-center text-gray-400 mt-10">
          Loading cart…
        </p>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {cartItems.length === 0 ? (
        <div className="p-10 text-center">
          <h2 className="text-xl font-semibold">
            Your cart is empty 🛒
          </h2>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border border-gray-600 p-4 rounded-md mb-4"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-400">₹{item.price}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>

                  <span className="font-medium">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <h2 className="font-bold mt-6 text-right">
            Total: ₹{total}
          </h2>

          {/* ✅ Checkout button ONLY when cart has items */}
          <div className="text-right">
            <Link
              href="/checkout"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
