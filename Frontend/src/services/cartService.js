import api from './api';

const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy giỏ hàng' };
    }
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể thêm vào giỏ hàng' };
    }
  },

  // Cập nhật số lượng
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể cập nhật giỏ hàng' };
    }
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể xóa sản phẩm' };
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể xóa giỏ hàng' };
    }
  },
};

export default cartService;
