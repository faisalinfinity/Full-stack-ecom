import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/order";
import adminRoutes from "./routes/admin";
import productsRoutes from './routes/products'; 
import cors from "cors";
require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/products', productsRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
