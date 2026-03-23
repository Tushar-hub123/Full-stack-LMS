import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/* ═══════════════════════════════════════════
   POST /api/auth/register
   Register a new student account
═══════════════════════════════════════════ */
router.post("/register", async (req, res) => {
  try {
    const { rollNo, name, branch, email, password } = req.body;

    if (!rollNo || !name || !password) {
      return res.status(400).json({ message: "Roll number, name, and password are required" });
    }

    const existing = await User.findOne({ rollNo: rollNo.trim() });
    if (existing) {
      return res.status(400).json({ message: "Student with this roll number already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const student = new User({
      role: "student",
      rollNo: rollNo.trim(),
      name: name.trim(),
      branch: branch?.trim() || "",
      email: email?.trim() || "",
      password: hashed,
    });

    await student.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   POST /api/auth/login
   Login for both student (rollNo) and admin (adminId)
═══════════════════════════════════════════ */
router.post("/login", async (req, res) => {
  try {
    const { rollNo, adminId, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    let user;

    // ── Admin login ──────────────────────────
    if (adminId) {
      user = await User.findOne({ adminId: adminId.trim(), role: "admin" });
      if (!user) {
        return res.status(404).json({ message: "Admin account not found" });
      }
    }

    // ── Student login ────────────────────────
    else if (rollNo) {
      user = await User.findOne({ rollNo: rollNo.trim(), role: "student" });
      if (!user) {
        return res.status(404).json({ message: "Student account not found" });
      }
    }

    else {
      return res.status(400).json({ message: "Provide rollNo or adminId" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({
      _id:     user._id,
      role:    user.role,
      rollNo:  user.rollNo  || null,
      adminId: user.adminId || null,
      name:    user.name,
      branch:  user.branch  || null,
      email:   user.email   || null,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
