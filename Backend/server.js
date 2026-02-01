const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Simple logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cors());

// Body parsing middleware cải thiện
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    
    if (contentType && contentType.includes('application/json')) {
      let body = '';
      
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        console.log(`${req.method} ${req.url} - Raw body:`, body);
        
        try {
          // Parse JSON normally
          req.body = JSON.parse(body);
          console.log('Successfully parsed JSON:', req.body);
        } catch (error) {
          // If normal parse fails, try to handle double stringify
          console.log('Normal JSON parse failed for:', body);
          
          try {
            // Remove surrounding quotes if present
            const cleaned = body.replace(/^"|"$/g, '');
            // Try to parse cleaned string
            req.body = JSON.parse(cleaned);
            console.log('Fixed double stringify:', req.body);
          } catch (fixError) {
            console.log('Cannot fix body, using raw string:', body);
            req.body = { rawBody: body };
          }
        }
        next();
      });
    } else {
      // Use default express parsers for other content types
      next();
    }
  } else {
    next();
  }
});

// Fallback cho form data
app.use(express.urlencoded({ extended: true }));

// Serve static files từ thư mục images
app.use('/images', express.static(path.join(__dirname, '../images')));

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