import api from './api';

const categoryService = {
  // Lấy danh sách danh mục
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy danh sách danh mục' };
    }
  },

  // Lấy chi tiết danh mục
  getCategory: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy thông tin danh mục' };
    }
  },
};

export default categoryService;
