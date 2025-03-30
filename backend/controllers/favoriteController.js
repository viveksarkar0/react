// / File: controllers/favoriteController.js
const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    let favorites = await Favorite.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price images description brand category rating numReviews',
    });

    if (!favorites) {
      favorites = await Favorite.create({
        user: req.user._id,
        products: [],
      });
    }

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add product to favorites
// @route   POST /api/favorites/:productId
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let favorites = await Favorite.findOne({ user: req.user._id });

    if (!favorites) {
      favorites = await Favorite.create({
        user: req.user._id,
        products: [productId],
      });
    } else {
      // Check if product already in favorites
      if (!favorites.products.includes(productId)) {
        favorites.products.push(productId);
        await favorites.save();
      }
    }

    // Populate product details before returning
    const updatedFavorites = await Favorite.findById(favorites._id).populate({
      path: 'products',
      select: 'name price images description brand category rating numReviews',
    });

    res.json(updatedFavorites);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    let favorites = await Favorite.findOne({ user: req.user._id });

    if (!favorites) {
      return res.status(404).json({ message: 'Favorites not found' });
    }

    // Remove product from favorites
    favorites.products = favorites.products.filter(
      (id) => id.toString() !== productId
    );

    await favorites.save();

    // Populate product details before returning
    const updatedFavorites = await Favorite.findById(favorites._id).populate({
      path: 'products',
      select: 'name price images description brand category rating numReviews',
    });

    res.json(updatedFavorites);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
};