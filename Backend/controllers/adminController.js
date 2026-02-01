const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Lấy thống kê tổng quan cho admin
// @route   GET /api/admin/stats
// @access  Admin only
exports.getStats = async (req, res) => {
  try {
    // Đếm tổng số users, products, orders
    const [usersCount, productsCount, ordersCount, totalRevenue] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$total_price' }
          }
        }
      ])
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        revenue: revenue
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

// @desc    Lấy danh sách users cho admin
// @route   GET /api/admin/users
// @access  Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(query, '-password')
      .limit(Number(limit))
      .skip(skip)
      .sort({ created_at: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật role user
// @route   PUT /api/admin/users/:id/role
// @access  Admin only
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['admin', 'staff', 'customer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role không hợp lệ'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật role thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Xóa user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa user thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy thống kê đơn hàng theo thời gian
// @route   GET /api/admin/orders/analytics
// @access  Admin only
exports.getOrderAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = {
          created_at: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case '30d':
        dateFilter = {
          created_at: {
            $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case '90d':
        dateFilter = {
          created_at: {
            $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          }
        };
        break;
    }

    const analytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" }
          },
          orderCount: { $sum: 1 },
          revenue: { $sum: "$total_price" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy tất cả đơn hàng cho admin
// @route   GET /api/admin/orders
// @access  Admin only
exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name sku price images')
      .limit(Number(limit))
      .skip(skip)
      .sort({ created_at: -1 });
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật trạng thái đơn hàng
// @route   PUT /api/admin/orders/:orderId/status
// @access  Admin only
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Check if status change is allowed
    const allowedTransitions = {
      'pending': ['processing', 'cancelled'],
      'processing': ['shipping', 'completed', 'cancelled'],
      'shipping': ['completed', 'cancelled'],
      'completed': [], // Final state
      'cancelled': []  // Final state
    };

    if (!allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Không thể chuyển trạng thái từ '${order.status}' sang '${status}'`
      });
    }

    // Use findByIdAndUpdate to avoid validation issues
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status: status, 
        updated_at: new Date() 
      },
      { 
        new: true, 
        runValidators: false // Skip validation to avoid issues with existing data
      }
    );

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Lấy chi tiết đơn hàng
// @route   GET /api/admin/orders/:orderId
// @access  Admin only  
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name price images sku');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/admin/products
// @access  Admin only
exports.createProduct = async (req, res) => {
  try {
    console.log('Create Product Request Body:', req.body);
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: tên, giá, danh mục'
      });
    }
    
    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = 'SKU' + Date.now();
    }
    
    console.log('Creating product with data:', productData);
    const product = new Product(productData);
    await product.save();
    
    console.log('Product created successfully:', product);
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message,
      error: error.message
    });
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/admin/products/:productId
// @access  Admin only
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/admin/products/:productId
// @access  Admin only
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Tạo danh mục mới
// @route   POST /api/admin/categories
// @access  Admin only
exports.createCategory = async (req, res) => {
  try {
    const Category = require('../models/Category');
    const categoryData = req.body;
    
    const category = new Category(categoryData);
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Cập nhật danh mục
// @route   PUT /api/admin/categories/:categoryId
// @access  Admin only
exports.updateCategory = async (req, res) => {
  try {
    const Category = require('../models/Category');
    const { categoryId } = req.params;
    const updateData = req.body;
    
    const category = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Xóa danh mục
// @route   DELETE /api/admin/categories/:categoryId
// @access  Admin only
exports.deleteCategory = async (req, res) => {
  try {
    const Category = require('../models/Category');
    const { categoryId } = req.params;
    
    // Check if there are products in this category
    const productsInCategory = await Product.countDocuments({ category_id: categoryId });
    
    if (productsInCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục vì có ${productsInCategory} sản phẩm đang sử dụng danh mục này`
      });
    }
    
    const category = await Category.findByIdAndDelete(categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};