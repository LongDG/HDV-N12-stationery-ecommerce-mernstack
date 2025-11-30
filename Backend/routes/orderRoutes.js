const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Tất cả routes đều yêu cầu đăng nhập
router.use(protect);

// Order routes
router.get('/', getAllOrders);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/payment', updatePaymentStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
