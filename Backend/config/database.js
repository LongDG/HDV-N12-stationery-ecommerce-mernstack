// config/database.js

const mongoose = require('mongoose');

// Đường dẫn kết nối MongoDB - ưu tiên dùng environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vanphongpham';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Các tùy chọn 'useCreateIndex' và 'useFindAndModify' không cần thiết từ Mongoose 6 trở lên
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Thoát process nếu kết nối thất bại
        process.exit(1); 
    }
};

module.exports = connectDB;