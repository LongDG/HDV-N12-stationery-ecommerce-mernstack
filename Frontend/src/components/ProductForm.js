import React, { useState, useEffect } from 'react';
import api from '../services/api';

const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  
  if (name.includes('bút') || name.includes('viết')) return '✏️';
  if (name.includes('giấy') || name.includes('tờ') || name.includes('in')) return '📄';
  if (name.includes('sổ') || name.includes('tập') || name.includes('note')) return '📖';
  if (name.includes('bìa') || name.includes('file') || name.includes('folder')) return '📁';
  if (name.includes('băng') || name.includes('keo') || name.includes('dính')) return '📏';
  if (name.includes('bảng') || name.includes('tên') || name.includes('thẻ')) return '🏷️';
  if (name.includes('chi') || name.includes('gọt') || name.includes('dao')) return '✂️';
  if (name.includes('hóa') || name.includes('đơn') || name.includes('bill')) return '🧾';
  if (name.includes('máy') || name.includes('tính') || name.includes('calculator')) return '🖥️';
  if (name.includes('dụng cụ') || name.includes('phụ kiện') || name.includes('khác')) return '🛠️';
  
  const firstChar = name.charAt(0);
  if (firstChar === 'b') return '📝';
  if (firstChar === 's') return '📚';
  if (firstChar === 'g') return '📋';
  if (firstChar === 'm') return '💻';
  if (firstChar === 'd') return '🔧';
  
  return '📦';
};

const ProductForm = ({ product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '', // Change from stock_quantity to stock
    category_id: '',
    supplier_id: '',
    discount_percent: '',
    sku: '',
    images: '', // Change from array to string
    status: 1 // Change from string to number
  });
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '', // Map to stock field
        category_id: product.category_id?._id || product.category_id || '',
        supplier_id: product.supplier_id?._id || product.supplier_id || '',
        discount_percent: product.discount_percent || '',
        sku: product.sku || '',
        images: product.images || '', // Single string instead of array
        status: product.status || 1 // Number instead of string
      });
    }
  }, [product]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data
      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock), // Use stock instead of stock_quantity
        discount_percent: Number(formData.discount_percent) || 0,
        status: Number(formData.status) // Ensure status is number
      };

      if (product) {
        // Update existing product
        await api.put(`/admin/products/${product._id}`, submitData);
      } else {
        // Create new product
        await api.post('/admin/products', submitData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Lỗi khi lưu sản phẩm: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Để trống để tự động tạo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảm giá (%)
              </label>
              <input
                type="number"
                name="discount_percent"
                value={formData.discount_percent}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {getCategoryIcon(category.name)} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhà cung cấp
              </label>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map(supplier => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Tạm dừng</option>
              </select>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn hình ảnh
            </label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="images/folder/filename.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ví dụ: images/1-Bia/Bìa 6 ngăn nút cài.jpg
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : (product ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;