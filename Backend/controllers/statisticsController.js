const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Thống kê tổng quan
// @route   GET /api/statistics/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    // Tổng số đơn hàng
    const totalOrders = await Order.countDocuments();
    
    // Tổng số sản phẩm
    const totalProducts = await Product.countDocuments();
    
    // Tổng số người dùng
    const totalUsers = await User.countDocuments();
    
    // Tổng doanh thu (đơn hàng đã thanh toán)
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Đơn hàng chờ xử lý
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Sản phẩm sắp hết hàng (stock < 10)
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
    
    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        pendingOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Thống kê doanh thu theo thời gian
// @route   GET /api/statistics/revenue
// @access  Private
exports.getRevenueStatistics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let matchStage = { paymentStatus: 'paid' };
    
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }
    
    // Group format dựa vào groupBy
    let groupFormat;
    switch (groupBy) {
      case 'month':
        groupFormat = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
        break;
      case 'year':
        groupFormat = { year: { $year: '$createdAt' } };
        break;
      default: // day
        groupFormat = { 
          year: { $year: '$createdAt' }, 
          month: { $month: '$createdAt' }, 
          day: { $dayOfMonth: '$createdAt' } 
        };
    }
    
    const revenueData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: revenueData.length,
      data: revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Thống kê sản phẩm bán chạy
// @route   GET /api/statistics/top-products
// @access  Private
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalQuantity: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 1,
          name: '$productInfo.name',
          image: '$productInfo.image',
          price: '$productInfo.price',
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      count: topProducts.length,
      data: topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Thống kê theo danh mục
// @route   GET /api/statistics/by-category
// @access  Private
exports.getStatisticsByCategory = async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$category',
          categoryName: { $first: '$categoryInfo.name' },
          productCount: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { productCount: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      count: categoryStats.length,
      data: categoryStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Thống kê trạng thái đơn hàng
// @route   GET /api/statistics/order-status
// @access  Private
exports.getOrderStatusStatistics = async (req, res) => {
  try {
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: statusStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Thống kê sản phẩm tồn kho thấp
// @route   GET /api/statistics/low-stock
// @access  Private
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStockProducts = await Product.find({ 
      stock: { $lt: Number(threshold) } 
    })
      .populate('category', 'name')
      .sort({ stock: 1 })
      .select('name price stock category image');
    
    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
