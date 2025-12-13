const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID là bắt buộc'],
    unique: true // Mỗi user chỉ có 1 giỏ hàng
  },
  items: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID là bắt buộc']
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng là bắt buộc'],
      min: [1, 'Số lượng phải lớn hơn 0']
    }
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Tự động cập nhật updated_at trước khi save
cartSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
