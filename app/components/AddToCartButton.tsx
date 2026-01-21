// "use client";

// import { useCart } from "@/app/context/CartContext";

// type Props = {
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     image?: string;
//   };
// };

// export default function AddToCartButton({ product }: Props) {
//   const { addToCart } = useCart();

//   return (
//     <button
//       onClick={() =>
//         addToCart({
//           _id: product._id,
//           name: product.name,
//           price: product.price,
//           image: product.image,
//           qty: 1,
//         })
//       }
//       className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
//     >
//       Add to Cart
//     </button>
//   );
// }


"use client";

import { useCart } from "@/app/context/CartContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        })
      }
      className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
    >
      Add to Cart
    </button>
  );
}
