import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
  user: mongoose.Types.ObjectId;
}

const CartItemSchema: Schema<ICartItem> = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);
