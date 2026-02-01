import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Cart = () => {
  const { cartItems, total, loading, updateCartItem, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const notification = useNotification();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const handleUpdateQuantity = async (itemId, action) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item) return;
    
    let newQuantity = item.quantity;
    if (action === 'increase') {
      newQuantity += 1;
    } else if (action === 'decrease' && item.quantity > 1) {
      newQuantity -= 1;
    }
    
    if (newQuantity !== item.quantity) {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    notification.confirm(
      '🗑️ Bạn có chắc muốn xóa sản phẩm này?',
      async () => {
        await removeFromCart(itemId);
        notification.success('✓ Đã xóa sản phẩm khỏi giỏ hàng');
      }
    );
  };

  if (!user) {
    return (
      <div className="swiss-container py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem giỏ hàng</p>
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
        <h1 className="text-3xl font-bold mb-2">GIỎ HÀNG CỦA BẠN</h1>
        <div className="w-16 h-1 bg-red-600"></div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="grid grid-cols-12 gap-8">
          
          {/* Cart Items */}
          <div className="col-span-12 lg:col-span-8">
            <div className="border border-gray-200 shadow-md rounded-lg overflow-hidden bg-white">
              
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
                <div className="col-span-6 font-bold text-sm">SẢN PHẨM</div>
                <div className="col-span-2 font-bold text-sm text-center">ĐƠN GIÁ</div>
                <div className="col-span-2 font-bold text-sm text-center">SỐ LƯỢNG</div>
                <div className="col-span-2 font-bold text-sm text-right">THÀNH TIỀN</div>
              </div>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div key={item._id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all">
                  
                  {/* Product Info */}
                  <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                      {item.product_id?.images ? (
                        <img 
                          src={`http://localhost:5000/${item.product_id.images}`} 
                          alt={item.product_id?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-300">
                            {item.product_id?.name?.charAt(0) || item.product?.name?.charAt(0) || item.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-1">
                        <Link 
                          to={`/products/${item.product_id?._id || item.product?._id || item._id}`}
                          className="hover:text-red-600 transition-colors"
                        >
                          {item.product_id?.name || item.product?.name || item.name || 'Unnamed Product'}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">
                        Mã: {item.product_id?.sku || item.product?.code || item.code || item.product_id?._id?.slice(-8).toUpperCase() || item.product?._id?.slice(-8).toUpperCase() || item._id?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 flex items-center md:justify-center">
                    <div>
                      <span className="md:hidden text-sm text-gray-600 block mb-1">Đơn giá:</span>
                      <span className="font-bold">
                        {formatPrice(item.product_id?.price || item.product?.price || item.price || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex items-center md:justify-center">
                    <div>
                      <span className="md:hidden text-sm text-gray-600 block mb-1">Số lượng:</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, 'decrease')}
                          className="w-8 h-8 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded"
                        >
                          −
                        </button>
                        
                        <span className="w-12 text-center font-bold">
                          {item.quantity}
                        </span>
                        
                        <button 
                          onClick={() => handleUpdateQuantity(item._id, 'increase')}
                          className="w-8 h-8 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-4 md:col-span-2 flex items-center md:justify-end">
                    <div>
                      <span className="md:hidden text-sm text-gray-600 block mb-1">Thành tiền:</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice((item.product_id?.price || item.product?.price || item.price || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button (Mobile) */}
                  <div className="col-span-12 mt-4">
                    <button 
                      onClick={() => handleRemoveItem(item._id)}
                      className="w-full md:w-auto px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded"
                    >
                      XÓA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-span-12 lg:col-span-4">
            <div className="border-2 border-gray-900 p-8 sticky top-24 rounded-lg">
              
              <h2 className="font-bold text-2xl mb-6 tracking-wide">TỔNG ĐƠN HÀNG</h2>
              
              <div className="space-y-4 pb-6 border-b-2 border-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-bold">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-bold">Miễn phí</span>
                </div>
              </div>
              
              <div className="flex justify-between py-6 mb-6">
                <span className="text-2xl font-bold">TỔNG CỘNG:</span>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(total)}
                </span>
              </div>
              
              <Link to="/checkout" className="btn-primary w-full h-14 flex items-center justify-center mb-4">
                THANH TOÁN
              </Link>
              
              <Link to="/products" className="btn-secondary w-full text-center inline-block">
                TIẾP TỤC MUA HÀNG
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart */
        <div className="text-center py-24">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gray-100 mx-auto mb-6 flex items-center justify-center rounded-full">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">GIỎ HÀNG TRỐNG</h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
          </div>
          
          <Link to="/products" className="btn-primary inline-block">
            KHÁM PHÁ SẢN PHẨM
          </Link>
        </div>
      )}
    </section>
  );
};

export default Cart;
