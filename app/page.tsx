// export default function HomePage() {
//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold">
//         ShopSphere
//       </h1>

//       <p className="mt-2 text-gray-600">
//         Products will be loaded here from backend
//       </p>
//     </main>
//   );
// }

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        ShopSphere
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-full object-cover mb-3"
            />

            <h2 className="text-lg font-semibold">
              {product.name}
            </h2>

            <p className="text-gray-700">
              ₹{product.price}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
