// File: controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images countInStock',
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is in stock
    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Product out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate product details before returning the cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images countInStock',
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the cart item
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Verify product is in stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Product out of stock' });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    // Populate product details before returning the cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images countInStock',
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the item
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await cart.save();

    // Populate product details before returning the cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images countInStock',
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared',
        cart: cart });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

  module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
  