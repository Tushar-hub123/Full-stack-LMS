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

/* ================= CORS FIX ================= */

const allowedOrigins = [
  "https://lms-frontend-eta-orcin.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.options("*", cors());

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= ROOT ROUTE ================= */

app.get("/", (req,res)=>{
  res.send("Library API running");
});

/* ================= ROUTES ================= */

app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);

/* ================= DATABASE ================= */

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  console.log("MongoDB connected");

  const admin = await User.findOne({ role: "admin" });

  if (!admin) {

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      role: "admin",
      adminId: process.env.ADMIN_ID,
      name: "Library Admin",
      password: hashed
    });

    console.log("Admin created");
  }

})
.catch(err=>{
  console.log("MongoDB connection error:", err.message);
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log("Server running on port", PORT);
});