import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 border p-4 rounded-lg">
      <img
        src={item.image}
        alt={item.title}
        className="w-20 h-20 object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-gray-500">₹{item.price}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => decreaseQty(item.id)}
            className="px-2 border"
          >
            −
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => increaseQty(item.id)}
            className="px-2 border"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
