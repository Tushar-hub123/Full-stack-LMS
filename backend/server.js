import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cartRoutes from "./routes/cart.js";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import bookRoutes from "./routes/books.js";
import transactionRoutes from "./routes/transactions.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lms-frontend-eta-orcin.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));



app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/cart", cartRoutes); 
app.use("/api/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected");

    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      await User.create({
        role: "admin",
        adminId: process.env.ADMIN_ID,   // ✅ FIX
        name: "Library Admin",
        password: hashed
      });

      console.log("Admin created");
    }
  });



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);


app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
