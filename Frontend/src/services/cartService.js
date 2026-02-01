import api from './api';

// Helper để lấy user_id từ localStorage
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    try {
      const userId = getUserId();
      const response = await api.get('/cart', { params: { user_id: userId } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy giỏ hàng' };
    }
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (productId, quantity = 1) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw { message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' };
      }
      const response = await api.post('/cart', { 
        user_id: userId,
        product_id: productId, 
        quantity 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error || { message: 'Không thể thêm vào giỏ hàng' };
    }
  },

  // Cập nhật số lượng
  updateCartItem: async (productId, quantity) => {
    try {
      const userId = getUserId();
      const response = await api.put(`/cart/${productId}`, { 
        user_id: userId,
        quantity 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể cập nhật giỏ hàng' };
    }
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: async (productId) => {
    try {
      const userId = getUserId();
      const response = await api.delete(`/cart/${productId}`, {
        data: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể xóa sản phẩm' };
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      const userId = getUserId();
      const response = await api.delete('/cart', {
        data: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể xóa giỏ hàng' };
    }
  },
};

export default cartService;
