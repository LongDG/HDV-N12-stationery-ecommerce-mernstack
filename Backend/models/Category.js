const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên danh mục'],
    trim: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
});

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
