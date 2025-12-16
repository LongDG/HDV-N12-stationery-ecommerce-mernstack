# HDV Project

Dự án full-stack với Backend Node.js (MVC) và Frontend React.js

## Cấu trúc dự án

```
HDV/
├── Backend/          # Node.js Backend với cấu trúc MVC
│   ├── config/       # Cấu hình (database, etc.)
│   ├── controllers/  # Controllers xử lý logic
│   ├── models/       # Models định nghĩa dữ liệu
│   ├── routes/       # Routes định nghĩa API endpoints
│   ├── middleware/   # Middleware functions
│   ├── views/        # Views (nếu cần)
│   ├── server.js     # File chính để chạy server
│   └── package.json
│
└── Frontend/         # React.js Frontend
    ├── public/       # Static files
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Cài đặt và chạy

### Backend

1. Di chuyển vào thư mục Backend:
```bash
cd Backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` (copy từ `.env.example` nếu có):
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hdv
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

4. Chạy server:
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: http://localhost:5000

### Frontend

1. Di chuyển vào thư mục Frontend:
```bash
cd Frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- bcryptjs (Password hashing)

### Frontend
- React.js
- React Router DOM
- Axios (HTTP client)

## Ghi chú

- Backend sử dụng cấu trúc MVC (Model-View-Controller)
- Frontend sử dụng React Router để điều hướng
- Proxy đã được cấu hình trong Frontend để kết nối với Backend API

## Lệnh bỏ đường dẫn ảnh vào CSDL MongoDB trong file vanphongpham.products.json

Sau đây là 1 Ví dụ:   "images": "[object Object],[object Object]", // chưa có đường dẫn

Ta thay bằng:   "images": "\/images\/Clean Architecture.webp",      // có đường dẫn ảnh .webp

Hoặc bằng:   "images": "\/images\/Clean Architecture.jpg",      // có đường dẫn ảnh .jpg

Mội dung commit: sua lai duong dan anh cua products va them anh cho san pham