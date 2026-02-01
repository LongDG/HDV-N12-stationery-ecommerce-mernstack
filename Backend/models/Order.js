const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Số lượng phải lớn hơn 0']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Giá phải lớn hơn hoặc bằng 0']
  }
});

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vui lòng chọn người dùng']
  },
  items: [orderItemSchema],
  total_price: {
    type: Number,
    required: true,
    min: [0, 'Tổng tiền phải lớn hơn hoặc bằng 0']
  },
  shipping_address: {
    type: String,
    required: [true, 'Vui lòng nhập địa chỉ giao hàng']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
