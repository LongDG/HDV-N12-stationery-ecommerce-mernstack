const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên nhà cung cấp'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập email hợp lệ']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
