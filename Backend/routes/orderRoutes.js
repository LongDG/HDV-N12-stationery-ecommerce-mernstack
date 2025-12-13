const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// Order routes - Public
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrder)
  .delete(deleteOrder);

router.patch('/:id/status', updateOrderStatus);

module.exports = router;
