const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Routes có thể dùng với token hoặc user_id trong body
router.route('/')
  .get(getCart)           // Lấy giỏ hàng
  .post(addToCart)        // Thêm vào giỏ
  .delete(clearCart);     // Xóa toàn bộ giỏ

router.route('/:product_id')
  .put(updateCartItem)    // Cập nhật số lượng
  .delete(removeCartItem); // Xóa 1 sản phẩm

module.exports = router;
