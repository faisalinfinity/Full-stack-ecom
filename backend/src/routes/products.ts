import { Router, Request, Response } from "express";
import Product from "../models/Product";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({}).skip(skip).limit(limit);
    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
