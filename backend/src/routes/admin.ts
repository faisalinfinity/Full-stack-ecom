import { Router, Request, Response } from "express";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/admin";
import Product from "../models/Product";

const router = Router();

router.post("/product/add", async (req: Request, res: Response) => {
  try {
    const { name, price, stock, image } = req.body;
    if (!name || !price || stock === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide name, price, and stock" });
    }

    const newProduct = new Product({
      name,
      price,
      stock,
      image: image ? image : "",
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/product/bulk-add", async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of products" });
    }

    const newProducts = await Product.insertMany(products);
    res.status(201).json({ message: "Products added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
