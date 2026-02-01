const express = require('express');
const {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getOrderAnalytics,
  getAllOrdersForAdmin,
  updateOrderStatus,
  getOrderDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');

const router = express.Router();

// Middleware để check admin role (tạm thời comment cho dễ test)
// const adminAuth = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     return res.status(403).json({
//       success: false,
//       message: 'Không có quyền truy cập'
//     });
//   }
// };

// Admin stats routes
router.get('/stats', getStats);
router.get('/orders/analytics', getOrderAnalytics);
router.get('/orders', getAllOrdersForAdmin);
router.get('/orders/:orderId', getOrderDetails);
router.put('/orders/:orderId/status', updateOrderStatus);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Product management routes
router.post('/products', createProduct);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

// Category management routes
router.post('/categories', createCategory);
router.put('/categories/:categoryId', updateCategory);
router.delete('/categories/:categoryId', deleteCategory);

module.exports = router;