import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId, // que use el id que genera mongo
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId, // que use el id que genera mongo
    ref: "Category",
    required: true,
  },
});
export const productModel = mongoose.model("Product", productSchema);
