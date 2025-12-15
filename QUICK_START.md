# Hướng dẫn nhanh - HDV Project

## ✅ Frontend đã chạy thành công!

Frontend đang chạy tại: **http://localhost:3000**

### Lệnh chạy Frontend:
```bash
# Ở thư mục Frontend
npm start
```

## 🔧 Bước tiếp theo - Chạy Backend

### 1. Cài đặt Backend dependencies

**Quan trọng:** Bạn cần di chuyển vào thư mục Backend trước!

```bash
# Từ thư mục Frontend, di chuyển lên một cấp và vào Backend
cd ..\Backend

# Hoặc nếu đang ở thư mục gốc HDV
cd Backend

# Sau đó cài đặt dependencies
npm install
```

### 2. Tạo file .env cho Backend

Tạo file `.env` trong thư mục `Backend` với nội dung:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hdv
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

**Lưu ý:** 
- Nếu bạn chưa cài MongoDB, có thể bỏ qua MONGODB_URI tạm thời
- Backend vẫn có thể chạy được nhưng chức năng đăng ký/đăng nhập sẽ cần MongoDB

### 3. Chạy Backend server

**Lưu ý:** Đảm bảo bạn đang ở thư mục Backend!

```bash
# Kiểm tra bạn đang ở đúng thư mục
# Nên thấy: PS F:\HDV\Backend>

npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

### 📌 Tóm tắt lệnh:

**Frontend:**
- Thư mục: `Frontend/`
- Lệnh: `npm start`
- Port: 3000

**Backend:**
- Thư mục: `Backend/`
- Lệnh: `npm run dev` (hoặc `npm start` cho production)
- Port: 5000

### 4. Test ứng dụng
ư
1. Mở trình duyệt và truy cập: http://localhost:3000
2. Click vào "Đăng nhập / Đăng ký" ở header
3. Test chức năng đăng ký/đăng nhập

## 📝 Lưu ý về các Warnings

Các cảnh báo về deprecated packages bạn thấy là bình thường:
- ✅ Không ảnh hưởng đến việc chạy ứng dụng
- ✅ Có thể bỏ qua trong giai đoạn phát triển
- ⚠️ Có thể cập nhật sau nếu cần

## 🗄️ Cài đặt MongoDB (Tùy chọn)

Nếu bạn muốn sử dụng MongoDB:

### Option 1: Cài đặt MongoDB Local
1. Tải MongoDB từ: https://www.mongodb.com/try/download/community
2. Cài đặt và chạy MongoDB service

### Option 2: Sử dụng MongoDB Atlas (Cloud - Miễn phí)
1. Đăng ký tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string và cập nhật vào file `.env`

## 🚀 Cấu trúc trang Auth

Trang `/auth` bao gồm:
- **Tab "Đăng nhập"**: Form đăng nhập với email và password
- **Tab "Đăng ký"**: Form đăng ký với name, email, password và confirm password
- Chuyển đổi giữa 2 tab bằng cách click vào tab tương ứng
- Tự động redirect về trang chủ sau khi đăng nhập/đăng ký thành công

## 🐛 Troubleshooting

### Frontend không kết nối được với Backend
- Kiểm tra Backend đã chạy tại port 5000
- Kiểm tra proxy trong `Frontend/package.json` đã được cấu hình

### Lỗi khi đăng ký/đăng nhập
- Kiểm tra MongoDB đã được cài đặt và chạy
- Kiểm tra file `.env` trong Backend đã được tạo đúng
- Xem console log để biết lỗi cụ thể

