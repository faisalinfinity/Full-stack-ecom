import mongoose, { Document, Schema } from "mongoose";

export type PaymentStatus = "Pending" | "Paid" | "Failed";
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

export interface IOrderProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  totalPrice: number;
  shippingAddress: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: Date;
}

const OrderProductSchema: Schema<IOrderProduct> = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema: Schema<IOrder> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: { type: [OrderProductSchema], required: true },
  totalPrice: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", OrderSchema);
