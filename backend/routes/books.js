import express from "express";
import multer from "multer";
import path from "path";
import Book from "../models/Book.js";

const router = express.Router();

/* ── Multer config ─────────────────────────────────── */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
               allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Only image files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/* ═══════════════════════════════════════════
   GET /api/books
   Public — fetch all books
═══════════════════════════════════════════ */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error("Get books error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   GET /api/books/:id
   Public — fetch single book
═══════════════════════════════════════════ */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   POST /api/books
   Admin — add a new book (with optional image)
═══════════════════════════════════════════ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const book = new Book({
      title:    title.trim(),
      author:   author.trim(),
      image:    req.file ? req.file.filename : "",
      quantity: parseInt(quantity) || 0,
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (err) {
    console.error("Add book error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PUT /api/books/:id
   Admin — update book details
═══════════════════════════════════════════ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    const updateData = {
      ...(title    && { title:    title.trim()    }),
      ...(author   && { author:   author.trim()   }),
      ...(quantity !== undefined && { quantity: parseInt(quantity) }),
      ...(req.file && { image: req.file.filename }),
    };

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    console.error("Update book error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   PATCH /api/books/:id/quantity
   Admin — update only quantity
═══════════════════════════════════════════ */
router.patch("/:id/quantity", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: "Valid quantity required" });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { quantity: parseInt(quantity) },
      { new: true }
    );

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Quantity updated", book });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════
   DELETE /api/books/:id
   Admin — delete a book
═══════════════════════════════════════════ */
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
