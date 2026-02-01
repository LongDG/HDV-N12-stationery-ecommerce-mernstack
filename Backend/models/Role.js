const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên vai trò'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Role || mongoose.model('Role', roleSchema);