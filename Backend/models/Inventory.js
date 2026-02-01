const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Vui lòng chọn sản phẩm']
  },
  type: {
    type: String,
    enum: ['import', 'export'],
    required: [true, 'Vui lòng chọn loại giao dịch']
  },
  change_qty: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng thay đổi']
  },
  note: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
