import type React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
        Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <p className="mt-4 text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item._id} className="py-6 flex">
                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                  <img
                    src={item.product.image}
                    onError={(e) =>
                      (e.currentTarget.src = `https://picsum.photos/seed/${item._id}/200/200`)
                    }
                    alt={item.product.name}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="ml-4 flex-1 flex gap-2 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.product.name}</h3>
                      <p className="ml-4">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="flex-1 flex items-end justify-between text-sm">
                    <Button
                      variant="destructive"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{" "}
                <Button
                  variant="link"
                  onClick={clearCart}
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Clear Cart
                  <span aria-hidden="true"> &rarr;</span>
                </Button>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
