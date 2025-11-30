# Backend API Documentation

## Tổng quan

Backend API cho hệ thống bán văn phòng phẩm với kiến trúc RESTful, sử dụng Node.js, Express và MongoDB.

## Base URL
```
http://localhost:5000/api
```

## Authentication

Hầu hết các endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication APIs

### 1.1 Đăng ký
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@email.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@email.com"
  }
}
```

### 1.2 Đăng nhập
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "nguyenvana@email.com",
  "password": "password123"
}
```

### 1.3 Lấy thông tin user hiện tại
```http
GET /api/auth/me
```
*Requires authentication*

---

## 2. Product APIs

### 2.1 Lấy danh sách sản phẩm
```http
GET /api/products
```

**Query Parameters:**
- `category` - Lọc theo danh mục
- `search` - Tìm kiếm theo tên
- `minPrice` - Giá tối thiểu
- `maxPrice` - Giá tối đa
- `status` - active/inactive
- `page` - Trang (default: 1)
- `limit` - Số lượng/trang (default: 10)

**Example:**
```
GET /api/products?category=67abc&search=bút&minPrice=5000&page=1&limit=10
```

### 2.2 Lấy sản phẩm theo ID
```http
GET /api/products/:id
```

### 2.3 Tạo sản phẩm mới
```http
POST /api/products
```
*Requires authentication*

**Body:**
```json
{
  "name": "Bút bi xanh",
  "description": "Bút bi xanh chất lượng cao",
  "price": 5000,
  "category": "category_id",
  "stock": 100,
  "image": "url_to_image",
  "status": "active"
}
```

### 2.4 Cập nhật sản phẩm
```http
PUT /api/products/:id
```
*Requires authentication*

### 2.5 Xóa sản phẩm
```http
DELETE /api/products/:id
```
*Requires authentication*

### 2.6 Cập nhật tồn kho
```http
PATCH /api/products/:id/stock
```
*Requires authentication*

**Body:**
```json
{
  "stock": 50
}
```

---

## 3. Category APIs

### 3.1 Lấy tất cả danh mục
```http
GET /api/categories
```

### 3.2 Lấy danh mục theo ID
```http
GET /api/categories/:id
```

### 3.3 Tạo danh mục mới
```http
POST /api/categories
```
*Requires authentication*

**Body:**
```json
{
  "name": "Văn phòng phẩm",
  "description": "Các sản phẩm văn phòng phẩm"
}
```

### 3.4 Cập nhật danh mục
```http
PUT /api/categories/:id
```
*Requires authentication*

### 3.5 Xóa danh mục
```http
DELETE /api/categories/:id
```
*Requires authentication*

---

## 4. Order APIs

### 4.1 Lấy tất cả đơn hàng
```http
GET /api/orders
```
*Requires authentication*

**Query Parameters:**
- `status` - pending/processing/shipped/delivered/cancelled
- `paymentStatus` - pending/paid/failed
- `page` - Trang (default: 1)
- `limit` - Số lượng/trang (default: 10)

### 4.2 Lấy đơn hàng của tôi
```http
GET /api/orders/my-orders
```
*Requires authentication*

### 4.3 Lấy đơn hàng theo ID
```http
GET /api/orders/:id
```
*Requires authentication*

### 4.4 Tạo đơn hàng mới
```http
POST /api/orders
```
*Requires authentication*

**Body:**
```json
{
  "orderItems": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "address": "123 Đường ABC",
    "city": "TP.HCM",
    "phone": "0123456789"
  },
  "paymentMethod": "cash"
}
```

### 4.5 Cập nhật trạng thái đơn hàng
```http
PATCH /api/orders/:id/status
```
*Requires authentication*

**Body:**
```json
{
  "status": "processing"
}
```

### 4.6 Cập nhật trạng thái thanh toán
```http
PATCH /api/orders/:id/payment
```
*Requires authentication*

**Body:**
```json
{
  "paymentStatus": "paid"
}
```

### 4.7 Xóa đơn hàng
```http
DELETE /api/orders/:id
```
*Requires authentication*

---

## 5. Statistics APIs

### 5.1 Thống kê tổng quan
```http
GET /api/statistics/overview
```
*Requires authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalProducts": 45,
    "totalUsers": 30,
    "totalRevenue": 15000000,
    "pendingOrders": 5,
    "lowStockProducts": 3
  }
}
```

### 5.2 Thống kê doanh thu
```http
GET /api/statistics/revenue
```
*Requires authentication*

**Query Parameters:**
- `startDate` - Ngày bắt đầu (ISO format)
- `endDate` - Ngày kết thúc (ISO format)
- `groupBy` - day/month/year (default: day)

**Example:**
```
GET /api/statistics/revenue?startDate=2024-01-01&endDate=2024-12-31&groupBy=month
```

### 5.3 Sản phẩm bán chạy
```http
GET /api/statistics/top-products
```
*Requires authentication*

**Query Parameters:**
- `limit` - Số lượng (default: 10)

### 5.4 Thống kê theo danh mục
```http
GET /api/statistics/by-category
```
*Requires authentication*

### 5.5 Thống kê trạng thái đơn hàng
```http
GET /api/statistics/order-status
```
*Requires authentication*

### 5.6 Sản phẩm tồn kho thấp
```http
GET /api/statistics/low-stock
```
*Requires authentication*

**Query Parameters:**
- `threshold` - Ngưỡng tồn kho (default: 10)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thông báo",
  "data": { /* dữ liệu */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "error": "Chi tiết lỗi"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
