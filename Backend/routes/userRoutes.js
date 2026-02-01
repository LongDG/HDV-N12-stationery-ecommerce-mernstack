const express = require('express');
const router = express.Router();
const { getUserStats } = require('../controllers/authController');

// User stats route  
router.get('/stats', getUserStats);

module.exports = router;