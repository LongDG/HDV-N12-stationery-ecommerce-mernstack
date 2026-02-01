const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getRelatedProducts,
  getFeaturedProducts,
  getBestSellerProducts,
  getProductStats
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/stats', getProductStats);
router.get('/featured', getFeaturedProducts);
router.get('/best-seller', getBestSellerProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

// Private routes (yêu cầu đăng nhập)
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/stock', protect, updateStock);

module.exports = router;
