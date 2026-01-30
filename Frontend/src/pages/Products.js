import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || 'name',
      };
      
      const response = await productService.getProducts(params);
      if (response.success) {
        setProducts(response.data?.products || response.data || []);
        setTotalProducts(response.data?.total || response.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('name');
    setSearchParams({});
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Đã thêm vào giỏ hàng!');
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-8">
        <div className="swiss-container">
          <h1 className="text-4xl font-bold text-white mb-2">TẤT CẢ SẢN PHẨM</h1>
          <p className="text-red-100">{totalProducts} sản phẩm</p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="swiss-container py-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Sidebar Filters */}
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              
              {/* Search */}
              <div className="mb-6">
                <label className="font-bold mb-3 block text-gray-900">TÌM KIẾM</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <label className="font-bold mb-3 block text-gray-900">DANH MỤC</label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group p-2 rounded hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="category" 
                      value="" 
                      checked={selectedCategory === ''}
                      onChange={(e) => { setSelectedCategory(e.target.value); }}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-red-600 transition-colors">Tất cả</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center cursor-pointer group p-2 rounded hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat._id}
                        checked={selectedCategory === cat._id}
                        onChange={(e) => { setSelectedCategory(e.target.value); }}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-red-600 transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Sort */}
              <div className="mb-6">
                <label className="font-bold mb-3 block text-gray-900">SẮP XẾP</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="name">Tên A-Z</option>
                  <option value="price">Giá thấp → cao</option>
                  <option value="-price">Giá cao → thấp</option>
                  <option value="-createdAt">Mới nhất</option>
                </select>
              </div>

              {/* Apply & Reset Buttons */}
              <button 
                onClick={applyFilters}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium mb-2"
              >
                ÁP DỤNG
              </button>
              
              <button 
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                XÓA BỘ LỌC
              </button>
            </div>
          </aside>
          
          {/* Products Grid */}
          <div className="col-span-12 md:col-span-9">
            
            {/* Results Count & View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sản phẩm</h2>
                <p className="text-gray-600">{totalProducts} sản phẩm có sẵn</p>
              </div>
              
              {/* View Toggle */}
              <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {products.map((product) => {
                      const discount = Math.floor(Math.random() * 30) + 10;
                      const oldPrice = product.price * (100 + discount) / 100;
                      
                      return (
                        <article key={product._id} className="group bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
                          <Link to={`/products/${product._id}`} className="block">
                            {/* Image */}
                            <div className="aspect-square bg-white overflow-hidden relative">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <span className="text-6xl text-gray-300 font-bold">
                                    {product.name?.charAt(0) || '?'}
                                  </span>
                                </div>
                              )}
                              
                              {/* Badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">HOT</span>
                              </div>
                              
                              {/* Discount Badge */}
                              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full">
                                -{discount}%
                              </div>
                            </div>
                            
                            {/* Info */}
                            <div className="p-3">
                              <h3 className="text-sm leading-tight mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                {product.name}
                              </h3>
                              
                              {/* Rating */}
                              <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                  </svg>
                                ))}
                              </div>
                              
                              {/* Price */}
                              <div className="mb-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-red-600 font-bold text-lg">
                                    {formatPrice(product.price)}
                                  </span>
                                  <span className="text-gray-400 line-through text-sm">
                                    {formatPrice(oldPrice)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          {/* Quick Add Button */}
                          <div className="px-3 pb-3">
                            <button 
                              onClick={() => handleAddToCart(product._id)}
                              className="w-full py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded font-medium text-sm"
                            >
                              THÊM VÀO GIỎ
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4 mb-12">
                    {products.map((product) => {
                      const discount = Math.floor(Math.random() * 30) + 10;
                      const oldPrice = product.price * (100 + discount) / 100;
                      
                      return (
                        <article key={product._id} className="group bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden">
                          <div className="flex">
                            {/* Image */}
                            <Link to={`/products/${product._id}`} className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48">
                              <div className="w-full h-full bg-white overflow-hidden relative">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <span className="text-4xl text-gray-300 font-bold">
                                      {product.name?.charAt(0) || '?'}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full">
                                  -{discount}%
                                </div>
                              </div>
                            </Link>
                            
                            {/* Info */}
                            <div className="flex-1 p-4 flex flex-col justify-between">
                              <div>
                                <Link to={`/products/${product._id}`}>
                                  <h3 className="text-lg font-medium mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                                    {product.name}
                                  </h3>
                                </Link>
                                
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2 hidden md:block">
                                  {product.description || 'Sản phẩm chất lượng cao, phù hợp cho mọi nhu cầu văn phòng phẩm.'}
                                </p>
                                
                                {/* Stock info */}
                                <div className="flex items-center gap-4 text-sm">
                                  {(product.stock_quantity || product.stockQuantity) > 0 ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                      </svg>
                                      Còn hàng
                                    </span>
                                  ) : (
                                    <span className="text-red-600">Hết hàng</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-4">
                                {/* Price */}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-bold text-xl">
                                      {formatPrice(product.price)}
                                    </span>
                                    <span className="text-gray-400 line-through text-sm">
                                      {formatPrice(oldPrice)}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <button 
                                  onClick={() => handleAddToCart(product._id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm"
                                >
                                  THÊM VÀO GIỎ
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600 mb-6">Hãy thử tìm kiếm với từ khóa khác</p>
                <button onClick={resetFilters} className="btn-primary">
                  XÓA BỘ LỌC
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
