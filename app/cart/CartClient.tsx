


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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Cart</h1>

      {cartItems.length === 0 ? (
        <div className="p-8 sm:p-10 text-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            Your cart is empty 🛒
          </h2>
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-600 p-3 sm:p-4 rounded-md gap-3 sm:gap-0"
              >
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-0">₹{item.price.toLocaleString()}</p>

                  <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-2 sm:px-3 py-1 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
                    >
                      −
                    </button>

                    <span className="font-medium text-sm sm:text-base min-w-[20px] text-center">{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-2 sm:px-3 py-1 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <p className="text-sm sm:text-base font-semibold sm:hidden">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs sm:text-sm text-red-500 hover:text-red-400 hover:underline transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg sm:text-xl font-semibold">Total:</span>
              <span className="text-lg sm:text-xl font-bold text-green-400">
                ₹{total.toLocaleString()}
              </span>
            </div>

            {/* ✅ Checkout button ONLY when cart has items */}
            <Link
              href="/checkout"
              className="block w-full sm:w-auto sm:inline-block text-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
