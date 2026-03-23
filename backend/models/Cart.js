import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,   // stores rollNo
      required: true,
      trim: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    status: {
      type: String,
      enum: ["cart", "approved", "rejected", "returned"],
      default: "cart",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
