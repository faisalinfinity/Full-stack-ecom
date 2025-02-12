import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "./AuthContext";
import axios from "axios";
import type { Product } from "@/types";
import { BASE_URL } from "@/config/baseurl";
interface CartItem {
  _id?: string;
  product?: Product;
  name?: string;
  image?: string;
  price?: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  checkout: (shippingAddress: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const addToCart = async(item: CartItem) => {
    return axios
      .post(
        BASE_URL+"/api/cart/add",
        { productId: item._id, quantity: item.quantity },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((response) => {
        setCartItems(response.data.updatedCart);
        toast({
          title: "Added to Cart",
          description: `${item.product.name} has been added to your cart.`,
        });
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });
  };

  const checkout = async (shippingAddress: string) => {
    return axios
      .post(
        BASE_URL+"/api/orders/place",
        { shippingAddress },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then(() => {
        setCartItems([]);
      })
      .catch((error) => {
        console.error("Error in Checkout", error);
      });
  };

  const removeFromCart = (id: string) => {
    axios
      .delete(BASE_URL+`/api/cart/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((response) => {
        setCartItems(response.data.updatedCart)
        toast({
          title: "Removed from Cart",
          description: "The item has been removed from your cart.",
        });
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
        toast({
          title: "Error",
          description:
            "An error occurred while removing the item from your cart.",
        });
      });
  };

  const clearCart = () => {
    axios
      .delete(BASE_URL+`/api/cart/delete`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then(() => {
        setCartItems([]);
      })
      .catch((error) => {
        console.error("Error clearing cart:", error);
      });

    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(BASE_URL+`/api/cart`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
