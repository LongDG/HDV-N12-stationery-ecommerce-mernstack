import api from './api';

const cartService = {
  // Helper để lấy user_id từ localStorage
  getCurrentUserId: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id || user?._id || null;
    } catch {
      return null;
    }
  },

  // Lấy giỏ hàng
  getCart: async () => {
    try {
      const userId = cartService.getCurrentUserId();
      
      if (!userId) {
        throw new Error('Chưa đăng nhập');
      }
      
      const response = await api.get(`/cart?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('getCart error:', error);
      throw error.response?.data || { message: 'Không thể lấy giỏ hàng' };
    }
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (productId, quantity = 1) => {
    try {
      const userId = cartService.getCurrentUserId();
      
      if (!userId) {
        throw new Error('Chưa đăng nhập');
      }
      
      const response = await api.post('/cart/add', { 
        user_id: userId,
        product_id: productId, 
        quantity 
      });
      return response.data;
    } catch (error) {
      console.error('addToCart error:', error);
      throw error.response?.data || { message: 'Không thể thêm vào giỏ hàng' };
    }
  },

  // Cập nhật số lượng
  updateCartItem: async (itemId, quantity) => {
    try {
      const userId = cartService.getCurrentUserId();
      
      if (!userId) {
        throw new Error('Chưa đăng nhập');
      }
      
      const response = await api.put(`/cart/update/${itemId}`, { 
        user_id: userId,
        quantity 
      });
      return response.data;
    } catch (error) {
      console.error('updateCartItem error:', error);
      throw error.response?.data || { message: 'Không thể cập nhật giỏ hàng' };
    }
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: async (itemId) => {
    try {
      const userId = cartService.getCurrentUserId();
      
      if (!userId) {
        throw new Error('Chưa đăng nhập');
      }
      
      const response = await api.delete(`/cart/remove/${itemId}`, {
        data: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('removeFromCart error:', error);
      throw error.response?.data || { message: 'Không thể xóa sản phẩm' };
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      const currentUser = localStorage.getItem('user');
      if (!currentUser) {
        throw new Error('Vui lòng đăng nhập');
      }
      
      const user = JSON.parse(currentUser);
      const userId = user._id || user.id;
      
      const response = await api.delete(`/cart/clear?user_id=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể xóa giỏ hàng' };
    }
  },
};

export default cartService;
