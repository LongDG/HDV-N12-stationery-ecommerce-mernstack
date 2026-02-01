const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;

