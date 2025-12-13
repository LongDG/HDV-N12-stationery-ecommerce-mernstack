const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'Vui lòng nhập mã SKU'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá sản phẩm'],
    min: [0, 'Giá phải lớn hơn hoặc bằng 0']
  },
  discount_percent: {
    type: Number,
    default: 0,
    min: [0, 'Giảm giá phải lớn hơn hoặc bằng 0'],
    max: [100, 'Giảm giá không vượt quá 100%']
  },
  images: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng tồn kho'],
    min: [0, 'Số lượng phải lớn hơn hoặc bằng 0'],
    default: 0
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Vui lòng chọn danh mục']
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  status: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
