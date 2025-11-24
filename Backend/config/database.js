// config/database.js

const mongoose = require('mongoose');

// Đường dẫn kết nối MongoDB local (mặc định)
const MONGODB_URI_LOCAL = 'mongodb://localhost:27017/vanphongpham'; 
// Thay 'ten_database_cua_ban' bằng tên database bạn muốn sử dụng

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI_LOCAL, {
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