# API DOCUMENTATION - HDV STATIONERY E-COMMERCE

Base URL: `http://localhost:5000/api`

## 📋 TABLE OF CONTENTS
1. [Authentication](#authentication)
2. [Categories](#categories)
3. [Suppliers](#suppliers)
4. [Products](#products)
5. [Inventories](#inventories)
6. [Orders](#orders)
7. [Payments](#payments)
8. [Statistics](#statistics)

---

## 🔐 AUTHENTICATION

### Register
- **POST** `/api/auth/register`
- **Body**:
```json
{
  "name": "Nguyen Van A",
  "email": "test@example.com",
  "password": "123456",
  "phone": "0123456789",
  "address": "123 Nguyen Trai, Q1, HCM",
  "role": "customer"
}
```

### Login
- **POST** `/api/auth/login`
- **Body**:
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

---

## 📂 CATEGORIES

### Get All Categories
- **GET** `/api/categories`

### Get Category By ID
- **GET** `/api/categories/:id`

### Create Category
- **POST** `/api/categories`
- **Body**:
```json
{
  "name": "Bút viết",
  "parent_id": null
}
```

### Update Category
- **PUT** `/api/categories/:id`
- **Body**:
```json
{
  "name": "Bút viết cao cấp"
}
```

### Delete Category
- **DELETE** `/api/categories/:id`

---

## 🏭 SUPPLIERS

### Get All Suppliers
- **GET** `/api/suppliers`

### Get Supplier By ID
- **GET** `/api/suppliers/:id`

### Create Supplier
- **POST** `/api/suppliers`
- **Body**:
```json
{
  "name": "Công ty Thiên Long",
  "email": "contact@thienlong.com",
  "phone": "0281234567",
  "address": "123 Đường ABC, Q1, HCM"
}
```

### Update Supplier
- **PUT** `/api/suppliers/:id`
- **Body**:
```json
{
  "phone": "0281234999"
}
```

### Delete Supplier
- **DELETE** `/api/suppliers/:id`

---

## 📦 PRODUCTS

### Get All Products
- **GET** `/api/products`

### Get Product By ID
- **GET** `/api/products/:id`

### Create Product
- **POST** `/api/products`
- **Body**:
```json
{
  "name": "Bút bi Thiên Long TL-079",
  "sku": "TL079",
  "description": "Bút bi cao cấp, mực xanh",
  "price": 5000,
  "discount_percent": 10,
  "images": ["https://example.com/image1.jpg"],
  "stock": 100,
  "category_id": "CATEGORY_ID_HERE",
  "supplier_id": "SUPPLIER_ID_HERE",
  "status": true
}
```

### Update Product
- **PUT** `/api/products/:id`
- **Body**:
```json
{
  "price": 4500,
  "discount_percent": 15
}
```

### Delete Product
- **DELETE** `/api/products/:id`

---

## 📊 INVENTORIES (Nhật ký kho)

### Get All Inventories
- **GET** `/api/inventories`

### Get Inventory By Product
- **GET** `/api/inventories/product/:productId`

### Create Inventory - Import (Nhập kho)
- **POST** `/api/inventories`
- **Body**:
```json
{
  "product_id": "PRODUCT_ID_HERE",
  "type": "import",
  "change_qty": 50,
  "note": "Nhập hàng từ nhà cung cấp"
}
```

### Create Inventory - Export (Xuất kho)
- **POST** `/api/inventories`
- **Body**:
```json
{
  "product_id": "PRODUCT_ID_HERE",
  "type": "export",
  "change_qty": 10,
  "note": "Xuất hàng cho đơn #123"
}
```

### Delete Inventory
- **DELETE** `/api/inventories/:id`

**Note**: Khi tạo inventory, hệ thống tự động cập nhật stock của product:
- `import`: Tăng stock
- `export`: Giảm stock (kiểm tra đủ hàng trước khi xuất)

---

## 🛒 ORDERS

### Get All Orders
- **GET** `/api/orders`

### Get Order By ID
- **GET** `/api/orders/:id`

### Create Order
- **POST** `/api/orders`
- **Body**:
```json
{
  "user_id": "USER_ID_HERE",
  "items": [
    {
      "product_id": "PRODUCT_ID_HERE",
      "name": "Bút bi Thiên Long TL-079",
      "quantity": 5,
      "price": 5000
    }
  ],
  "total_price": 25000,
  "shipping_address": "123 Nguyễn Trãi, Q1, TP.HCM",
  "status": "pending"
}
```

### Update Order Status
- **PUT** `/api/orders/:id`
- **Body**:
```json
{
  "status": "processing"
}
```
**Status values**: `pending`, `processing`, `shipped`, `completed`, `cancelled`

### Delete Order
- **DELETE** `/api/orders/:id`

---

## 💰 PAYMENTS

### Get All Payments
- **GET** `/api/payments`

### Get Payment By Order
- **GET** `/api/payments/order/:orderId`

### Get Payments By User
- **GET** `/api/payments/user/:userId`

### Create Payment
- **POST** `/api/payments`
- **Body**:
```json
{
  "order_id": "ORDER_ID_HERE",
  "user_id": "USER_ID_HERE",
  "payment_method": "momo",
  "amount": 25000,
  "transaction_code": "MOMO123456789",
  "note": "Thanh toán qua Momo"
}
```
**Payment methods**: `momo`, `cod`, `banking`

### Update Payment Status
- **PUT** `/api/payments/:id`
- **Body**:
```json
{
  "status": "completed"
}
```
**Status values**: `pending`, `completed`, `failed`

### Delete Payment
- **DELETE** `/api/payments/:id`

---

## 📈 STATISTICS

### Get Statistics
- **GET** `/api/statistics`

---

## 📝 NOTES

### Response Format
All endpoints return JSON in this format:
```json
{
  "success": true/false,
  "data": {},
  "message": "Error message if any"
}
```

### Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

### Testing with Postman
1. Import file `Postman_Collection.json` vào Postman
2. Set biến `baseUrl` = `http://localhost:5000/api`
3. Test từng endpoint theo thứ tự:
   - Tạo Category trước
   - Tạo Supplier
   - Tạo Product (cần category_id và supplier_id)
   - Tạo Inventory để cập nhật stock
   - Register/Login để lấy user_id
   - Tạo Order
   - Tạo Payment cho Order
