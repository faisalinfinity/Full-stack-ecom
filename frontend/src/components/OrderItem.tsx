import type React from "react";
import type { IOrder } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderItemProps {
  order: IOrder;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Order #{order._id}</CardTitle>
        <CardDescription>
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2">
          <span>Total Price:</span>
          <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping Address:</span>
          <span>{order.shippingAddress}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Payment Status:</span>
          <Badge
            variant={
              order.paymentStatus === "Paid"
                ? "secondary"
                : order.paymentStatus === "Failed"
                ? "destructive"
                : "default"
            }
          >
            {order.paymentStatus}
          </Badge>
        </div>
        <div className="flex justify-between mb-2">
          <span>Order Status:</span>
          <Badge variant="secondary">{order.orderStatus}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h4 className="font-semibold mb-2">Products:</h4>
          <ul>
            {order.products.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center mb-2"
              >
                <div className="flex items-center gap-1">
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-8 h-8 object-cover mr-2"
                  />
                  <span>
                    {item.product.name} (x{item.quantity})
                  </span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
};
