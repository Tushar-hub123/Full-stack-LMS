import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; // ✅ added
import { fileURLToPath } from "url"; // ✅ added
import Book from "../models/Book.js";

const router = express.Router();

/* ── Fix __dirname (ES module) ─────────────────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ── Ensure uploads folder exists ─────────────────── */
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ── Multer config ─────────────────────────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ fixed absolute path
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok =
      allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Only image files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ═══════════════════════════════════════════ */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error("Get books error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════ */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════ */
router.post("/", upload.single("image"), async (req, res) => {
  console.log("FILE:", req.file); // ✅ debug (keep for now)

  try {
    const { title, author, quantity } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      image: req.file ? req.file.filename : "",
      quantity: parseInt(quantity) || 0,
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (err) {
    console.error("Add book error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════ */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    const updateData = {
      ...(title && { title: title.trim() }),
      ...(author && { author: author.trim() }),
      ...(quantity !== undefined && { quantity: parseInt(quantity) }),
      ...(req.file && { image: req.file.filename }),
    };

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    console.error("Update book error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════ */
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