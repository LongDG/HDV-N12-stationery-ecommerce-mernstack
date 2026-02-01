import api from './api';

const orderService = {
  // Helper function to get current user ID
  getCurrentUserId: () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user._id || user.id;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  // Lấy danh sách đơn hàng của user
  getOrders: async () => {
    try {
      const userId = orderService.getCurrentUserId();
      if (!userId) {
        throw { message: 'Vui lòng đăng nhập để xem đơn hàng' };
      }
      
      const response = await api.get(`/orders?user_id=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy danh sách đơn hàng' };
    }
  },

  // Lấy chi tiết đơn hàng
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy thông tin đơn hàng' };
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể tạo đơn hàng' };
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (id) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể hủy đơn hàng' };
    }
  },
};

export default orderService;
