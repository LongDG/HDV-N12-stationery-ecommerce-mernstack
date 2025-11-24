const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API đang chạy!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Có lỗi xảy ra!', 
    error: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// server.js (hoặc app.js)

// 1. Khai báo Mongoose và kết nối database
// require('dotenv').config(); // Không cần thiết nếu bạn dùng đường dẫn cứng
const connectDB = require('./config/database'); 

connectDB(); // Gọi hàm để thực hiện kết nối

// 2. Các logic ứng dụng khác bắt đầu từ đây...
// Ví dụ:
// const express = require('express');
// const app = express();
// ...