import express from "express";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";

const router = express.Router();

/* ═══════════════════════════════════════════
   POST /api/cart/add
   Student — add book request to cart
═══════════════════════════════════════════ */
router.post("/add", async (req, res) => {
  try {
    const { studentId, bookId } = req.body;

    if (!studentId || !bookId) {
      return res.status(400).json({ message: "studentId and bookId are required" });
    }

    // Prevent duplicate pending request
    const existing = await Cart.findOne({ studentId, bookId, status: "cart" });
    if (existing) {
      return res.status(400).json({ message: "Book already in your requests" });
    }

    // Check book exists and has stock
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.quantity <= 0) return res.status(400).json({ message: "Book is out of stock" });

    const item = new Cart({ studentId, bookId });
    await item.save();

    res.status(201).json({ message: "Book request added", item });
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   DELETE /api/cart/remove
   Student — cancel a pending request
═══════════════════════════════════════════ */
router.delete("/remove", async (req, res) => {
  try {
    const { studentId, bookId } = req.body;

    await Cart.findOneAndDelete({ studentId, bookId, status: "cart" });
    res.json({ message: "Request removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/cart/student/:studentId
   Student — get their own borrow history
═══════════════════════════════════════════ */
router.get("/student/:studentId", async (req, res) => {
  try {
    const items = await Cart.find({ studentId: req.params.studentId })
      .populate("bookId")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/cart/admin/requests
   Admin — get all pending requests (status: cart)
═══════════════════════════════════════════ */
router.get("/admin/requests", async (req, res) => {
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
   GET /api/cart/admin/approved
   Admin — all currently borrowed (approved) books
═══════════════════════════════════════════ */
router.get("/admin/approved", async (req, res) => {
  try {
    const items = await Cart.find({ status: "approved" })
      .populate("bookId")
      .sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/cart/admin/all
   Admin — full history of all cart records
═══════════════════════════════════════════ */
router.get("/admin/all", async (req, res) => {
  try {
    const items = await Cart.find()
      .populate("bookId")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/cart/admin/student/:rollNo
   Admin — search a specific student's history
═══════════════════════════════════════════ */
router.get("/admin/student/:rollNo", async (req, res) => {
  try {
    const records = await Cart.find({ studentId: req.params.rollNo })
      .populate("bookId")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/cart/admin/approve/:id
   Admin — approve a request (deduct quantity)
═══════════════════════════════════════════ */
router.patch("/admin/approve/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Request not found" });

    const book = await Book.findById(cartItem.bookId);
    if (!book || book.quantity <= 0) {
      return res.status(400).json({ message: "Book is out of stock" });
    }

    book.quantity -= 1;
    await book.save();

    cartItem.status = "approved";
    await cartItem.save();

    res.json({ message: "Request approved" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/cart/admin/reject/:id
   Admin — reject a request
═══════════════════════════════════════════ */
router.patch("/admin/reject/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!cartItem) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/cart/admin/return/:id
   Admin — mark book as returned (restore quantity)
═══════════════════════════════════════════ */
router.patch("/admin/return/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Record not found" });

    const book = await Book.findById(cartItem.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    cartItem.status = "returned";
    await cartItem.save();

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    console.error("Return error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/cart/return/:id
   Student — self-return (also restores quantity)
═══════════════════════════════════════════ */
router.patch("/return/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Record not found" });

    const book = await Book.findById(cartItem.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    cartItem.status = "returned";
    await cartItem.save();

    res.json({ message: "Book returned" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
