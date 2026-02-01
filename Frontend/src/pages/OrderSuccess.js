import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (location.state?.orderId) {
      setOrderId(location.state.orderId);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="swiss-container">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đặt hàng thành công!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất có thể.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng:</p>
                <p className="font-mono text-lg font-semibold text-gray-900">#{orderId}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Link 
                to="/orders" 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Xem đơn hàng của tôi
              </Link>
              
              <Link 
                to="/products" 
                className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
              
              <Link 
                to="/" 
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Thông tin giao hàng:</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Đơn hàng sẽ được xác nhận trong vòng 24 giờ</li>
              <li>• Thời gian giao hàng: 2-5 ngày làm việc</li>
              <li>• Bạn sẽ nhận được email xác nhận đơn hàng</li>
              <li>• Hotline hỗ trợ: 1900-xxx-xxx</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;