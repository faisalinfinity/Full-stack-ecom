import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  image:string;
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image:{type:String,required:false}
});

export default mongoose.model<IProduct>("Product", ProductSchema);
