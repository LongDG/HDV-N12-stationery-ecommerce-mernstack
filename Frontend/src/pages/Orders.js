import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import orderService from '../services/orderService';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const notification = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response?.data || response || []);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không rõ';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Ngày không hợp lệ';
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      processing: { text: 'Đang xử lý', class: 'bg-indigo-100 text-indigo-800' },
      shipping: { text: 'Đang giao hàng', class: 'bg-purple-100 text-purple-800' },
      delivered: { text: 'Đã giao', class: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Đã hủy', class: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 text-sm font-bold rounded ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleCancelOrder = async (orderId) => {
    notification.info('📞 Vui lòng liên hệ hotline 0383277120 để hủy đơn hàng. Cảm ơn!');
  };

  const handleReorder = async (order) => {
    try {
      let successCount = 0;
      let failCount = 0;
      
      for (const item of order.items) {
        try {
          const result = await addToCart(item.product_id?._id || item.product_id, item.quantity);
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }
      
      if (successCount > 0) {
        notification.success(`✓ Đã thêm ${successCount} sản phẩm vào giỏ hàng!${failCount > 0 ? ` (${failCount} sản phẩm không thể thêm)` : ''}`);
      } else {
        notification.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!');
      }
    } catch (error) {
      notification.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
  };

  if (!user) {
    return (
      <div className="swiss-container py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
        <Link to="/login" className="btn-primary">
          ĐĂNG NHẬP
        </Link>
      </div>
    );
  }

  return (
    <section className="swiss-container py-16">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LỊCH SỬ ĐƠN HÀNG</h1>
        <div className="w-16 h-1 bg-red-600"></div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn-primary">
            THỬ LẠI
          </button>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
              
              {/* Order Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Mã đơn:</span>
                    <span className="font-bold ml-2">
                      #{order._id?.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Ngày đặt:</span>
                    <span className="font-bold ml-2">
                      {formatDate(order.created_at || order.createdAt)}
                    </span>
                  </div>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-4">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                        {item.product_id?.images || item.product?.images ? (
                          <img 
                            src={`http://localhost:5000/${item.product_id?.images || item.product?.images}`} 
                            alt={item.product_id?.name || item.product?.name || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-bold text-gray-300">
                              {item.product_id?.name?.charAt(0) || item.product?.name?.charAt(0) || item.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate">{item.product_id?.name || item.product?.name || item.name || 'Unnamed Product'}</h4>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-red-600">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {order.items?.length > 3 && (
                    <p className="text-sm text-gray-600">
                      + {order.items.length - 3} sản phẩm khác
                    </p>
                  )}
                </div>
              </div>
              
              {/* Order Footer */}
              <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-red-600 ml-2">
                    {formatPrice(order.total_price || order.total || 0)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/orders/${order._id}`}
                    className="px-4 py-2 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-bold rounded"
                  >
                    XEM CHI TIẾT
                  </Link>
                  
                  {order.status === 'delivered' && (
                    <button 
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all font-bold rounded"
                    >
                      MUA LẠI
                    </button>
                  )}
                  
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold rounded"
                    >
                      HỦY ĐƠN
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gray-100 mx-auto mb-6 flex items-center justify-center rounded-full">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">CHƯA CÓ ĐƠN HÀNG</h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có đơn hàng nào
            </p>
          </div>
          
          <Link to="/products" className="btn-primary inline-block">
            MUA HÀNG NGAY
          </Link>
        </div>
      )}
    </section>
  );
};

export default Orders;
