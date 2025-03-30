const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  brand: String,
  countInStock: Number,
  image: String, // Store image path
});


module.exports = mongoose.model("Product", ProductSchema);
