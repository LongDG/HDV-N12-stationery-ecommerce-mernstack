const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Lấy tất cả thanh toán
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('order_id', 'total_price status')
      .populate('user_id', 'name email')
      .sort('-payment_date');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy thanh toán theo đơn hàng
exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ order_id: req.params.orderId })
      .populate('order_id', 'total_price status')
      .populate('user_id', 'name email');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thanh toán'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy thanh toán theo user
exports.getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ user_id: req.params.userId })
      .populate('order_id', 'total_price status')
      .sort('-payment_date');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tạo thanh toán mới
exports.createPayment = async (req, res) => {
  try {
    const { order_id, user_id, payment_method, amount, transaction_code, note } = req.body;
    
    // Kiểm tra đơn hàng có tồn tại
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
    
    // Tạo thanh toán
    const payment = await Payment.create({
      order_id,
      user_id,
      payment_method,
      amount,
      transaction_code,
      note,
      payment_date: Date.now()
    });
    
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật trạng thái thanh toán
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thanh toán'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa thanh toán
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thanh toán'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa thanh toán thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
