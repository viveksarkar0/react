const express = require("express");
const multer = require("multer");
const Product = require("../models/Product"); // Ensure the correct path
const router = express.Router();

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create Product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category, brand, countInStock } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      brand,
      countInStock,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to add product", details: error.message });
  }
});

// Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

module.exports = router;
