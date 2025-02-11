import type React from "react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const CheckoutPage: React.FC = () => {
  const { cartItems, checkout } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [shippingAddress, setShippingAddress] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    checkout(shippingAddress).finally(() => {
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      });
      navigate("/orders");
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <form onSubmit={handleCheckout}>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Input
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item._id} className="py-4 flex justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-base font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CheckoutPage;
