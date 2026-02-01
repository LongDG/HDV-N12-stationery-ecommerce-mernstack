import api from './api';

const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await api.get(`/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy danh sách sản phẩm' };
    }
  },

  // Lấy chi tiết sản phẩm
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy thông tin sản phẩm' };
    }
  },

  // Lấy sản phẩm theo slug
  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy thông tin sản phẩm' };
    }
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get(`/products/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy sản phẩm nổi bật' };
    }
  },

  // Lấy sản phẩm liên quan
  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await api.get(`/products/${productId}/related?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy sản phẩm liên quan' };
    }
  },

  // Lấy sản phẩm bán chạy
  getBestSellerProducts: async (limit = 10) => {
    try {
      const response = await api.get(`/products/best-seller?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Không thể lấy sản phẩm bán chạy' };
    }
  },
};

export default productService;
