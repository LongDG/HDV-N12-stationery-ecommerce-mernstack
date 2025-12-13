const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Logging để debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging sau khi parse body
app.use((req, res, next) => {
  console.log('Body after parsing:', req.body);
  next();
});

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