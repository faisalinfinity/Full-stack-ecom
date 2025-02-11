import { Router, Request, Response } from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import CartItem from "../models/CartItem";
import Order from "../models/Order";
import Product from "../models/Product";

const router = Router();

router.post(
  "/place",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { shippingAddress } = req.body;

      if (!shippingAddress) {
        return res
          .status(400)
          .json({ message: "Shipping address is required" });
      }

      const cartItems = await CartItem.find({ user: req.user }).populate(
        "product"
      );
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      let totalPrice = 0;
      const orderProducts = [];

      for (const item of cartItems) {
        const product = await Product.findById(item.product._id);
        if (!product) {
          return res.status(404).json({
            message: `Product not found for item ${item.product._id}`,
          });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product ${product.name}`,
          });
        }

        product.stock -= item.quantity;
        await product.save();

        totalPrice += product.price * item.quantity;

        orderProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const order = new Order({
        user: req.user,
        products: orderProducts,
        totalPrice,
        shippingAddress,
        paymentStatus: Math.random() > 0.5 ? "Paid" : "Pending",  
        orderStatus:Math.random() > 0.5 ? "Shipped" : "Pending",
      });

      await order.save();

      await CartItem.deleteMany({ user: req.user });

      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await Order.find({ user: req.user }).populate(
        "products.product"
      );
      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
