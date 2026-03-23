import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";

const router = express.Router();

/* ═══════════════════════════════════════════
   GET /api/admin/stats
   Admin dashboard summary numbers
═══════════════════════════════════════════ */
router.get("/stats", async (req, res) => {
  try {
    const [totalBooks, totalStudents, pendingRequests, activeIssued] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "student" }),
      Cart.countDocuments({ status: "cart" }),
      Cart.countDocuments({ status: "approved" }),
    ]);

    res.json({ totalBooks, totalStudents, pendingRequests, activeIssued });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/admin/students
   Admin — list all students
═══════════════════════════════════════════ */
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/admin/students/:rollNo
   Admin — get one student by rollNo
═══════════════════════════════════════════ */
router.get("/students/:rollNo", async (req, res) => {
  try {
    const student = await User.findOne({
      rollNo: req.params.rollNo,
      role: "student",
    }).select("-password");

    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   POST /api/admin/add-student
   Admin — manually add a student account
═══════════════════════════════════════════ */
router.post("/add-student", async (req, res) => {
  try {
    const { rollNo, name, branch, email, password } = req.body;

    if (!rollNo || !name || !password) {
      return res.status(400).json({ message: "Roll number, name, and password are required" });
    }

    const existing = await User.findOne({ rollNo: rollNo.trim() });
    if (existing) {
      return res.status(400).json({ message: "Student already exists" });
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
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   DELETE /api/admin/students/:id
   Admin — delete a student account
═══════════════════════════════════════════ */
router.delete("/students/:id", async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/admin/requests
   Admin — all pending book requests
═══════════════════════════════════════════ */
router.get("/requests", async (req, res) => {
  try {
    const requests = await Cart.find({ status: "cart" })
      .populate("bookId")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/admin/approve/:cartId
   Admin — approve request
═══════════════════════════════════════════ */
router.patch("/approve/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ message: "Request not found" });

    const book = await Book.findById(cart.bookId);
    if (!book || book.quantity <= 0) {
      return res.status(400).json({ message: "Book is out of stock" });
    }

    book.quantity -= 1;
    cart.status = "approved";

    await book.save();
    await cart.save();

    res.json({ message: "Approved successfully" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/admin/reject/:cartId
   Admin — reject request
═══════════════════════════════════════════ */
router.patch("/reject/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.cartId,
      { status: "rejected" },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/admin/return/:cartId
   Admin — mark book as returned
═══════════════════════════════════════════ */
router.patch("/return/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ message: "Record not found" });

    const book = await Book.findById(cart.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    cart.status = "returned";
    await cart.save();

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    console.error("Return error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/admin/update-quantity/:bookId
   Admin — directly set book quantity
═══════════════════════════════════════════ */
router.patch("/update-quantity/:bookId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      { quantity: parseInt(quantity) },
      { new: true }
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Quantity updated", book });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
