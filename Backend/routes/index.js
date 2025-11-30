const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const statisticsRoutes = require('./statisticsRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/statistics', statisticsRoutes);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API route đang hoạt động!' 
  });
});

module.exports = router;

