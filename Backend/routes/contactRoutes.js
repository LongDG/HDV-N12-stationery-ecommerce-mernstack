const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

// Public route - tạo tin nhắn liên hệ
router.post('/', createContact);

// Admin routes - quản lý tin nhắn
router.get('/admin', getAllContacts);
router.put('/admin/:id', updateContact);
router.delete('/admin/:id', deleteContact);

module.exports = router;