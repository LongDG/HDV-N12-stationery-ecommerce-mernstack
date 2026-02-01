import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import ProductForm from '../components/ProductForm';
import CategoryForm from '../components/CategoryForm';
import RevenueReport from '../components/RevenueReport';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [showRevenueReport, setShowRevenueReport] = useState(false);

  // Dashboard stats
  useEffect(() => {
    if (user && (user.role_id === 'admin' || user.email === 'long@gmail.com')) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/products/stats'),
        api.get('/orders/stats')
      ]);
      
      setStats({
        users: usersRes.data.data?.count || 0,
        products: productsRes.data.data?.count || 0,
        orders: ordersRes.data.data?.count || 0,
        revenue: ordersRes.data.data?.revenue || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      notification.error('Lỗi khi tải thống kê');
    }
  };

  if (!user || (user.role_id !== 'admin' && user.email !== 'long@gmail.com')) {
    return (
      <div className="swiss-container py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">Truy cập bị từ chối</h2>
        <p className="text-gray-600">Bạn không có quyền truy cập trang quản trị</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

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

  const tabs = [
    { id: 'dashboard', name: 'Tổng quan', icon: '📊' },
    { id: 'products', name: 'Sản phẩm', icon: '📦' },
    { id: 'orders', name: 'Đơn hàng', icon: '🛒' },
    { id: 'users', name: 'Người dùng', icon: '👥' },
    { id: 'categories', name: 'Danh mục', icon: '📂' },
    { id: 'messages', name: 'Tin nhắn', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="swiss-container">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản trị Admin</h1>
              <p className="text-gray-600">Xin chào, {user.name || user.email}!</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                👑 Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="swiss-container">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 border-b-2 font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'border-red-600 text-red-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="swiss-container py-8">
        {activeTab === 'dashboard' && <DashboardTab stats={stats} onShowReport={() => setShowRevenueReport(true)} />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'messages' && <MessagesTab />}
      </div>
      
      {/* Revenue Report Modal */}
      {showRevenueReport && (
        <RevenueReport onClose={() => setShowRevenueReport(false)} />
      )}
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, onShowReport }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📊 Tổng quan hệ thống</h2>
        <button
          onClick={onShowReport}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
        >
          📊 Báo cáo Doanh thu
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng người dùng</p>
              <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-green-600">{stats.products}</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-purple-600">{stats.orders}</p>
            </div>
            <div className="text-3xl">🛒</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Doanh thu</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(stats.revenue)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-bold mb-4">⚡ Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
            <div className="text-2xl mb-2">➕</div>
            <div className="font-medium">Thêm sản phẩm mới</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-center">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">Xem đơn hàng mới</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Xem báo cáo</div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productStats, setProductStats] = useState({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const notification = useNotification();

  useEffect(() => {
    fetchProducts();
    fetchProductStats();
    fetchCategories();
  }, [currentPage, searchTerm, filterCategory, filterStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);
      if (filterStatus) params.append('status', filterStatus);

      const response = await api.get(`/products?${params}`);
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      notification.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      const response = await api.get('/products/stats');
      setProductStats(response.data.data);
    } catch (error) {
      console.error('Error fetching product stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
      await api.delete(`/admin/products/${productId}`);
      notification.success('Xóa sản phẩm thành công');
      fetchProducts();
      fetchProductStats();
    } catch (error) {
      console.error('Error deleting product:', error);
      notification.error('Lỗi khi xóa sản phẩm');
    }
  };

  const handleProductSave = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
    fetchProductStats();
    notification.success('Lưu sản phẩm thành công');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏳</div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📦 Quản lý sản phẩm</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleClearFilters}
              className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              🗑️ Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-lg">{productStats.count || 0}</div>
          <div className="text-blue-600 text-sm">Tổng sản phẩm</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-bold text-lg">{productStats.active || 0}</div>
          <div className="text-green-600 text-sm">Đang hoạt động</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 font-bold text-lg">{productStats.lowStock || 0}</div>
          <div className="text-yellow-600 text-sm">Sắp hết hàng</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600 font-bold text-lg">{productStats.outOfStock || 0}</div>
          <div className="text-red-600 text-sm">Hết hàng</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Ảnh</th>
                  <th className="text-left py-3">Tên sản phẩm</th>
                  <th className="text-left py-3">SKU</th>
                  <th className="text-left py-3">Giá</th>
                  <th className="text-left py-3">Kho</th>
                  <th className="text-left py-3">Trạng thái</th>
                  <th className="text-left py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      {product.images ? (
                        <img 
                          src={product.images} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          📦
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3 text-gray-600">{product.sku}</td>
                    <td className="py-3">{formatPrice(product.price)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        product.stock > 10 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        product.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.status === 1 ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-3 py-1">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterCategory || filterStatus ? 
                'Không tìm thấy sản phẩm phù hợp' : 
                'Chưa có sản phẩm nào'
              }
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSave={handleProductSave}
        />
      )}
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({});
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const notification = useNotification();

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Lấy tất cả đơn hàng (admin có thể xem tất cả)
      const response = await api.get('/admin/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      notification.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await api.get('/orders/stats');
      setOrderStats(response.data.data);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  const quickCompleteOrder = async (orderId, currentStatus) => {
    try {
      setUpdatingOrder(orderId);
      
      // Nếu đang pending, chuyển thành processing trước
      if (currentStatus === 'pending') {
        await api.put(`/admin/orders/${orderId}/status`, { status: 'processing' });
      }
      
      // Sau đó chuyển thành completed
      await api.put(`/admin/orders/${orderId}/status`, { status: 'completed' });
      
      // Reload orders after update
      await fetchOrders();
      await fetchOrderStats(); // Update stats
      notification.success('Đánh dấu đơn hàng hoàn thành thành công');
    } catch (error) {
      console.error('Error completing order:', error);
      notification.error('Lỗi khi hoàn thành đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingOrder(null);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      
      // Reload orders after update
      await fetchOrders();
      await fetchOrderStats(); // Update stats
      notification.success('Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      console.error('Error updating order status:', error);
      notification.error('Lỗi cập nhật trạng thái đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipping': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getAvailableStatusOptions = (currentStatus) => {
    const allStatuses = [
      { value: 'pending', label: 'Chờ xử lý' },
      { value: 'processing', label: 'Đang xử lý' },
      { value: 'shipping', label: 'Đang giao' },
      { value: 'completed', label: 'Hoàn thành' },
      { value: 'cancelled', label: 'Đã hủy' }
    ];

    // Logic cho phép chuyển trạng thái với ghi chú
    switch(currentStatus) {
      case 'pending':
        return allStatuses.filter(s => ['processing', 'cancelled'].includes(s.value));
      case 'processing':
        return allStatuses.filter(s => ['shipping', 'completed', 'cancelled'].includes(s.value));
      case 'shipping':
        return allStatuses.filter(s => ['completed', 'cancelled'].includes(s.value));
      case 'completed':
        return []; // Trạng thái cuối, không thể thay đổi
      case 'cancelled':
        return []; // Trạng thái cuối, không thể thay đổi
      default:
        console.warn('Unknown order status:', currentStatus);
        return [];
    }
  };

  const getStatusNote = (status) => {
    switch(status) {
      case 'pending': return 'Có thể chuyển thành: Đang xử lý hoặc Đã hủy';
      case 'processing': return 'Có thể chuyển thành: Đang giao, Hoàn thành hoặc Đã hủy';
      case 'shipping': return 'Có thể chuyển thành: Hoàn thành hoặc Đã hủy';
      case 'completed': return 'Đơn hàng đã hoàn thành';
      case 'cancelled': return 'Đơn hàng đã bị hủy';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏳</div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">🛒 Quản lý đơn hàng</h2>
      
      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-lg">{orderStats.count || 0}</div>
          <div className="text-blue-600 text-sm">Tổng đơn hàng</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 font-bold text-lg">{orderStats.pending || 0}</div>
          <div className="text-yellow-600 text-sm">Chờ xử lý</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-bold text-lg">{orderStats.completed || 0}</div>
          <div className="text-green-600 text-sm">Hoàn thành</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600 font-bold text-lg">{orderStats.cancelled || 0}</div>
          <div className="text-red-600 text-sm">Đã hủy</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 font-bold text-lg">{formatPrice(orderStats.revenue || 0)}</div>
          <div className="text-purple-600 text-sm">Doanh thu</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Mã đơn hàng</th>
                  <th className="text-left py-3">Khách hàng</th>
                  <th className="text-left py-3">Tổng tiền</th>
                  <th className="text-left py-3">Trạng thái</th>
                  <th className="text-left py-3">Ngày tạo</th>
                  <th className="text-left py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-mono text-sm">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{order.user_id?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{order.user_id?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="py-3 font-medium">{formatPrice(order.total_price)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3">
                      {/* Thao tác khác có thể thêm ở đây */}
                    </td>
                    <td className="py-3">
                      {getAvailableStatusOptions(order.status).length > 0 ? (
                        <div className="relative group">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            disabled={updatingOrder === order._id}
                            className="px-2 py-1 border rounded text-sm hover:border-blue-400 cursor-pointer"
                            title={getStatusNote(order.status)}
                          >
                            <option value={order.status}>{getStatusText(order.status)}</option>
                            {getAvailableStatusOptions(order.status).map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            {getStatusNote(order.status)}
                          </div>
                        </div>
                      ) : (
                        <div className="group relative">
                          <span className="text-gray-400 text-sm cursor-help">
                            {getStatusText(order.status)} (Không thể thay đổi)
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            {getStatusNote(order.status)}
                          </div>
                        </div>
                      )}
                      
                      {/* Nút hoàn thành nhanh - chỉ hiển thị cho orders chưa hoàn thành */}
                      {(order.status !== 'completed' && order.status !== 'cancelled') && (
                        <button
                          onClick={() => quickCompleteOrder(order._id, order.status)}
                          disabled={updatingOrder === order._id}
                          className="ml-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Hoàn thành đơn hàng (tự động qua các bước cần thiết)"
                        >
                          ✓ Hoàn thành
                        </button>
                      )}
                      
                      {updatingOrder === order._id && (
                        <span className="ml-2 text-blue-600 text-xs">Đang cập nhật...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const notification = useNotification();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users?page=${currentPage}&limit=10`);
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      notification.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      notification.success('Cập nhật quyền thành công');
      fetchUsers(); // Reload data
    } catch (error) {
      console.error('Error updating user role:', error);
      notification.error('Lỗi cập nhật quyền người dùng');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        notification.success('Xóa người dùng thành công');
        fetchUsers(); // Reload data
      } catch (error) {
        console.error('Error deleting user:', error);
        notification.error('Lỗi khi xóa người dùng');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏳</div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">👥 Quản lý người dùng</h2>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Tên</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Vai trò</th>
                  <th className="text-left py-3">Ngày tạo</th>
                  <th className="text-left py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{user.name}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </td>
                    <td className="py-3">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-3 py-1">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [productCounts, setProductCounts] = useState({});

  const notification = useNotification();

  useEffect(() => {
    fetchCategories();
    fetchProductCounts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      notification.error('Lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCounts = async () => {
    try {
      // Lấy số lượng sản phẩm theo danh mục
      const response = await api.get('/products');
      const products = response.data.data;
      const counts = {};
      
      products.forEach(product => {
        const categoryId = product.category_id?._id || product.category_id;
        if (categoryId) {
          counts[categoryId] = (counts[categoryId] || 0) + 1;
        }
      });
      
      setProductCounts(counts);
    } catch (error) {
      console.error('Error fetching product counts:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
      await api.delete(`/admin/categories/${categoryId}`);
      notification.success('Xóa danh mục thành công');
      fetchCategories();
      fetchProductCounts();
    } catch (error) {
      console.error('Error deleting category:', error);
      notification.error(error.response?.data?.message || 'Lỗi khi xóa danh mục');
    }
  };

  const handleCategorySave = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    fetchCategories();
    fetchProductCounts();
    notification.success('Lưu danh mục thành công');
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏳</div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📂 Quản lý danh mục</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          ➕ Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Tên danh mục</th>
                  <th className="text-left py-3">Mô tả</th>
                  <th className="text-left py-3">Số sản phẩm</th>
                  <th className="text-left py-3">Trạng thái</th>
                  <th className="text-left py-3">Ngày tạo</th>
                  <th className="text-left py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getCategoryIcon(category.name)}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {category.description ? 
                        (category.description.length > 50 ? 
                          category.description.substring(0, 50) + '...' : 
                          category.description
                        ) : 
                        'Không có mô tả'
                      }
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {productCounts[category._id] || 0}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {category.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">
                      {new Date(category.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có danh mục nào
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          onSave={handleCategorySave}
        />
      )}
    </div>
  );
};

const MessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [replyingMessage, setReplyingMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const notification = useNotification();

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await api.get('/contact/admin', { params });
      setMessages(response.data.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching messages:', error);
      notification.error('Lỗi khi tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) {
      notification.error('Vui lòng nhập nội dung phản hồi');
      return;
    }

    try {
      await api.put(`/contact/admin/${messageId}`, {
        admin_reply: replyText,
        status: 'replied'
      });
      
      setReplyingMessage(null);
      setReplyText('');
      notification.success('Gửi phản hồi thành công');
      fetchMessages();
    } catch (error) {
      console.error('Error replying:', error);
      notification.error('Lỗi khi gửi phản hồi');
    }
  };

  const updateStatus = async (messageId, status) => {
    try {
      await api.put(`/contact/admin/${messageId}`, { status });
      notification.success('Cập nhật trạng thái thành công');
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      notification.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;
    
    try {
      await api.delete(`/contact/admin/${messageId}`);
      notification.success('Xóa tin nhắn thành công');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      notification.error('Lỗi khi xóa tin nhắn');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Chờ xử lý';
      case 'replied': return 'Đã phản hồi';
      case 'resolved': return 'Đã giải quyết';
      default: return status;
    }
  };

  const getSubjectText = (subject) => {
    switch(subject) {
      case 'product': return 'Hỏi về sản phẩm';
      case 'order': return 'Hỗ trợ đơn hàng';
      case 'partnership': return 'Hợp tác kinh doanh';
      case 'feedback': return 'Góp ý, phản hồi';
      case 'other': return 'Khác';
      default: return subject;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏳</div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">💬 Quản lý tin nhắn liên hệ</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-lg">{stats.total || 0}</div>
          <div className="text-blue-600 text-sm">Tổng tin nhắn</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 font-bold text-lg">{stats.pending || 0}</div>
          <div className="text-yellow-600 text-sm">Chờ xử lý</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-lg">{stats.replied || 0}</div>
          <div className="text-blue-600 text-sm">Đã phản hồi</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-bold text-lg">{stats.resolved || 0}</div>
          <div className="text-green-600 text-sm">Đã giải quyết</div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">Tất cả tin nhắn</option>
          <option value="pending">Chờ xử lý</option>
          <option value="replied">Đã phản hồi</option>
          <option value="resolved">Đã giải quyết</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map(message => (
          <div key={message._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{message.name}</h3>
                <p className="text-gray-600">{message.email} • {message.phone}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${getStatusColor(message.status)}`}>
                  {getStatusText(message.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-sm font-medium text-blue-600">
                  {getSubjectText(message.subject)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-gray-800">{message.message}</p>
            </div>

            {message.admin_reply && (
              <div className="bg-blue-50 p-4 rounded mb-4">
                <p className="text-sm font-medium text-blue-800 mb-2">Phản hồi của admin:</p>
                <p className="text-blue-700">{message.admin_reply}</p>
                <p className="text-xs text-blue-600 mt-2">
                  {new Date(message.replied_at).toLocaleString('vi-VN')}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {message.status === 'pending' && (
                <button
                  onClick={() => setReplyingMessage(message._id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Phản hồi
                </button>
              )}
              
              {message.status === 'replied' && (
                <button
                  onClick={() => updateStatus(message._id, 'resolved')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Đánh dấu đã giải quyết
                </button>
              )}

              <button
                onClick={() => deleteMessage(message._id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>

            {/* Reply Form */}
            {replyingMessage === message._id && (
              <div className="mt-4 p-4 border rounded">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập phản hồi..."
                  rows="4"
                  className="w-full px-3 py-2 border rounded mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReply(message._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Gửi phản hồi
                  </button>
                  <button
                    onClick={() => {
                      setReplyingMessage(null);
                      setReplyText('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có tin nhắn nào
        </div>
      )}
    </div>
  );
};

export default Admin;