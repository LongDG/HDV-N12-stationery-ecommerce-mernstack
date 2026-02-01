const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên']
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Vui lòng chọn chủ đề'],
    enum: ['product', 'order', 'partnership', 'feedback', 'other']
  },
  message: {
    type: String,
    required: [true, 'Vui lòng nhập tin nhắn'],
    minlength: [3, 'Tin nhắn phải có ít nhất 3 ký tự']
  },
  status: {
    type: String,
    enum: ['pending', 'replied', 'resolved'],
    default: 'pending'
  },
  admin_reply: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  replied_at: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);