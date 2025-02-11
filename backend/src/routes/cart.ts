import { Router, Request, Response } from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import CartItem from "../models/CartItem";
import Product from "../models/Product";

const router = Router();

router.post(
  "/add",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { productId, quantity } = req.body;
      const qty = quantity ? parseInt(quantity) : 1;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.stock < qty) {
        return res
          .status(400)
          .json({ message: "Insufficient product stock available" });
      }

      const existingCartItem = await CartItem.findOne({
        user: req.user,
        product: productId,
      });
      if (existingCartItem) {
        existingCartItem.quantity += qty;
        await existingCartItem.save();
        return res.status(200).json({
          message: "Cart updated successfully",
          cartItem: existingCartItem,
        });
      }

      const cartItem = new CartItem({
        product: productId,
        quantity: qty,
        user: req.user,
      });

      await cartItem.save();
      const allCartItems = await CartItem.find({ user: req.user }).populate(
        "product"
      );

      res.status(201).json({
        message: "Product added to cart successfully",
        updatedCart: allCartItems,
      });
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
      const cartItems = await CartItem.find({ user: req.user }).populate(
        "product"
      );
      res.status(200).json({ cart: cartItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.delete(
  "/delete",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      await CartItem.deleteMany({ user: req.user });
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/delete/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      await CartItem.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Cart item deleted successfully",
        updatedCart: await CartItem.find({ user: req.user }).populate(
          "product"
        ),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
export default router;
