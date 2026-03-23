import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes        from "./routes/auth.js";
import bookRoutes        from "./routes/books.js";
import cartRoutes        from "./routes/cart.js";
import adminRoutes       from "./routes/admin.js";
import User              from "./models/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

/* ── Middleware ─────────────────────────────────────── */
// app.use(cors({
//   origin: [
//     "https://lms-frontend-eta-orcin.vercel.app"
//   ],
//   credentials: true,
// }));
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded book cover images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ── Routes ─────────────────────────────────────────── */
app.use("/api/auth",         authRoutes);
app.use("/api/books",        bookRoutes);
app.use("/api/cart",         cartRoutes);
app.use("/api/admin",        adminRoutes);

// Health check
app.get("/api", (req, res) => res.json({ status: "ok", message: "LMS API running" }));

/* ── Connect MongoDB & seed admin ───────────────────── */
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB Atlas connected");

    // Auto-create admin account if it doesn't exist
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        role:     "admin",
        adminId:  process.env.ADMIN_ID,
        name:     "Library Admin",
        password: hashed,
      });
      console.log(`✅ Admin created → ID: ${process.env.ADMIN_ID} | Password: ${process.env.ADMIN_PASSWORD}`);
    } else {
      console.log("ℹ️  Admin account already exists");
    }

    // Start server only after DB is connected
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

export default app;
