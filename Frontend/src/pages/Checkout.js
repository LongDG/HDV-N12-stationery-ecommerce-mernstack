import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import { getProductImage } from '../utils/imageHelper';

const Checkout = () => {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
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
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Giỏ hàng trống!');
      return;
    }

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward
        },
        note: formData.note,
        paymentMethod: formData.paymentMethod,
        total: total
      };

      const response = await orderService.createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      // Navigate to order success page
      navigate('/order-success', { state: { orderId: response._id } });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng!');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="swiss-container py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để thanh toán</p>
        <Link to="/login" className="btn-primary">
          ĐĂNG NHẬP
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="swiss-container py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
        <Link to="/products" className="btn-primary">
          KHÁM PHÁ SẢN PHẨM
        </Link>
      </div>
    );
  }

  return (
    <section className="swiss-container py-16">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">THANH TOÁN</h1>
        <div className="w-16 h-1 bg-red-600"></div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-8">
          
          {/* Customer Information */}
          <div className="col-span-12 lg:col-span-7">
            
            {/* Shipping Info */}
            <div className="border border-gray-200 p-6 mb-6 bg-white shadow-sm rounded-lg">
              <h2 className="font-bold text-xl mb-6">THÔNG TIN GIAO HÀNG</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block font-bold text-sm mb-2">
                    HỌ TÊN <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="swiss-input w-full"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block font-bold text-sm mb-2">
                    SỐ ĐIỆN THOẠI <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="swiss-input w-full"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block font-bold text-sm mb-2">EMAIL</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="swiss-input w-full"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block font-bold text-sm mb-2">
                    ĐỊA CHỈ <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường..."
                    className="swiss-input w-full"
                    required
                  />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block font-bold text-sm mb-2">TỈNH/THÀNH PHỐ</label>
                  <select 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="swiss-input w-full"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                    <option value="haiphong">Hải Phòng</option>
                  </select>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block font-bold text-sm mb-2">QUẬN/HUYỆN</label>
                  <select 
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="swiss-input w-full"
                  >
                    <option value="">Chọn quận/huyện</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block font-bold text-sm mb-2">PHƯỜNG/XÃ</label>
                  <select 
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="swiss-input w-full"
                  >
                    <option value="">Chọn phường/xã</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block font-bold text-sm mb-2">GHI CHÚ</label>
                  <textarea 
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ghi chú cho đơn hàng..."
                    className="swiss-input w-full resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="border border-gray-200 p-6 bg-white shadow-sm rounded-lg">
              <h2 className="font-bold text-xl mb-6">PHƯƠNG THỨC THANH TOÁN</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-red-600 transition-colors rounded-lg">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-4">
                    <span className="font-bold block">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm text-gray-600">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </span>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-red-600 transition-colors rounded-lg">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="banking"
                    checked={formData.paymentMethod === 'banking'}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-4">
                    <span className="font-bold block">Chuyển khoản ngân hàng</span>
                    <span className="text-sm text-gray-600">
                      Chuyển khoản qua tài khoản ngân hàng
                    </span>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 cursor-pointer hover:border-red-600 transition-colors rounded-lg opacity-50">
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="momo"
                    disabled
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-4">
                    <span className="font-bold block">Ví MoMo</span>
                    <span className="text-sm text-gray-600">
                      Sắp ra mắt
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-span-12 lg:col-span-5">
            <div className="border-2 border-gray-900 p-6 sticky top-24 rounded-lg">
              
              <h2 className="font-bold text-xl mb-6">ĐƠN HÀNG CỦA BẠN</h2>
              
              {/* Products */}
              <div className="space-y-4 pb-6 border-b-2 border-gray-300 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                      {getProductImage(item.product) ? (
                        <img 
                          src={getProductImage(item.product)} 
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-bold text-gray-300">
                            {item.product?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.product?.name}</h4>
                      <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-600">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="space-y-3 py-6 border-b-2 border-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-bold">Miễn phí</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="flex justify-between py-6 mb-6">
                <span className="text-xl font-bold">TỔNG CỘNG:</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(total)}
                </span>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-14 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ĐANG XỬ LÝ...
                  </span>
                ) : (
                  'ĐẶT HÀNG'
                )}
              </button>
              
              <Link to="/cart" className="btn-secondary w-full text-center inline-block mt-4">
                QUAY LẠI GIỎ HÀNG
              </Link>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
