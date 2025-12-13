const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Vui lòng chọn đơn hàng']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vui lòng chọn người dùng']
  },
  payment_method: {
    type: String,
    enum: ['momo', 'cod', 'banking'],
    required: [true, 'Vui lòng chọn phương thức thanh toán']
  },
  amount: {
    type: Number,
    required: [true, 'Vui lòng nhập số tiền'],
    min: [0, 'Số tiền phải lớn hơn hoặc bằng 0']
  },
  transaction_code: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  payment_date: {
    type: Date
  },
  note: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
