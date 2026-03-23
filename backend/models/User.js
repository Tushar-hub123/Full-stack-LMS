import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "student"],
      required: true,
    },

    // Student fields
    rollNo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Admin fields
    adminId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },

    branch: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
