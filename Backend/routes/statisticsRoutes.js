const express = require('express');
const router = express.Router();
const {
  getOverview,
  getRevenueStatistics,
  getTopProducts,
  getStatisticsByCategory,
  getOrderStatusStatistics,
  getLowStockProducts
} = require('../controllers/statisticsController');
const { protect } = require('../middleware/auth');

// Tất cả routes đều yêu cầu đăng nhập
router.use(protect);

// Statistics routes
router.get('/overview', getOverview);
router.get('/revenue', getRevenueStatistics);
router.get('/top-products', getTopProducts);
router.get('/by-category', getStatisticsByCategory);
router.get('/order-status', getOrderStatusStatistics);
router.get('/low-stock', getLowStockProducts);

module.exports = router;
