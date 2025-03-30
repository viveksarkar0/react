// File: routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites 
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/middleware');

router.get('/', protect, getFavorites);
router.post('/:productId', protect, addToFavorites);
router.delete('/:productId', protect, removeFromFavorites);

module.exports = router;