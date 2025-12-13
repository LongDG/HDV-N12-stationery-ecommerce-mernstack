const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Lấy tất cả đơn hàng
// @route   GET /api/orders
// @access  Public
exports.getAllOrders = async (req, res) => {
  try {
    const { status, user_id, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (user_id) {
      query.user_id = user_id;
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

// @desc    Lấy đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user_id', 'name email phone address')
      .populate('items.product_id', 'name sku price images');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy đơn hàng của user hiện tại
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name price image')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
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

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { user_id, items, shipping_address } = req.body;
    
    // Validate
    if (!user_id || !items || items.length === 0 || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin (user_id, items, shipping_address)'
      });
    }
    
    // Kiểm tra user tồn tại
    const userExists = await User.findById(user_id);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }
    
    // Validate và tính tổng tiền
    let total_price = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Sản phẩm ${item.product_id} không tồn tại`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product.name} không đủ số lượng (còn ${product.stock})`
        });
      }
      
      // Sử dụng price từ request hoặc từ product hiện tại
      const itemPrice = item.price || product.price;
      const itemName = item.name || product.name;
      
      validatedItems.push({
        product_id: product._id,
        name: itemName,
        quantity: item.quantity,
        price: itemPrice
      });
      
      total_price += itemPrice * item.quantity;
    }
    
    // Tạo đơn hàng
    const order = await Order.create({
      user_id,
      items: validatedItems,
      total_price,
      shipping_address,
      status: 'pending'
    });
    
    // Cập nhật tồn kho
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    const populatedOrder = await Order.findById(order._id)
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name sku images');
    
    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: populatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi tạo đơn hàng',
      error: error.message
    });
  }
};

// @desc    Cập nhật trạng thái đơn hàng
// @route   PATCH /api/orders/:id/status
// @access  Public
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Nếu hủy đơn hàng, hoàn lại tồn kho
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock: item.quantity } }
        );
      }
    }
    
    order.status = status;
    await order.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('user_id', 'name email')
      .populate('items.product_id', 'name sku');
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật đơn hàng
// @route   PUT /api/orders/:id
// @access  Public
exports.updateOrder = async (req, res) => {
  try {
    const updateData = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name sku price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi cập nhật đơn hàng',
      error: error.message
    });
  }
};

// @desc    Xóa đơn hàng
// @route   DELETE /api/orders/:id
// @access  Public
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Hoàn lại tồn kho nếu đơn chưa hoàn thành
    if (order.status !== 'completed' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock: item.quantity } }
        );
      }
    }
    
    await Order.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa đơn hàng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật trạng thái thanh toán (deprecated - dùng Payments model)
// @route   PATCH /api/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const validStatuses = ['pending', 'paid', 'failed'];
    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái thanh toán không hợp lệ'
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Xóa đơn hàng
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Chỉ cho phép xóa đơn hàng đã hủy hoặc chờ xử lý
    if (order.status !== 'cancelled' && order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể xóa đơn hàng đã hủy hoặc chờ xử lý'
      });
    }
    
    await Order.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
