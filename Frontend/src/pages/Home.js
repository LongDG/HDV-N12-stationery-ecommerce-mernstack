import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { getProductImage, getProductStock, getProductCategoryName } from '../utils/imageHelper';

// Category icon mapping
const categoryIcons = {
  'Bìa hồ sơ': '📁',
  'Bút ký': '🖊️',
  'Bút bi': '✒️',
  'Sổ': '📓',
  'Băng keo': '📦',
  'Bảng tên - dây đeo': '🏷️',
  'Bút chì gỗ': '✏️',
  'Hóa đơn': '🧾',
  'Giấy các loại': '📄',
  'Bấm kim': '📎',
  'Máy tính': '🖩',
  'Thước': '📏'
};

const getCategoryIcon = (category) => {
  return categoryIcons[category?.name] || '📦';
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ limit: 8 })
        ]);
        
        if (categoriesRes.success) {
          setCategories(categoriesRes.data || []);
        }
        if (productsRes.success) {
          setFeaturedProducts(productsRes.data?.products || productsRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-12">
        <div className="swiss-container">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded inline-block mb-4">
                  KHUYẾN MÃI LỚN
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  GIẢM ĐẾN <span className="text-red-600">40%</span>
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  Văn phòng phẩm chất lượng cao - Giá tốt nhất thị trường
                </p>
                <div className="flex gap-4">
                  <Link 
                    to="/products" 
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
                  >
                    MUA NGAY
                  </Link>
                  <Link 
                    to="/products" 
                    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-bold transition-all"
                  >
                    XEM THÊM
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex h-80 items-center justify-center overflow-hidden">
                <img 
                  src="/images/banner.png" 
                  alt="Banner văn phòng phẩm"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-gray-50 py-12">
        <div className="swiss-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">DANH MỤC NỔI BẬT</h2>
            <Link to="/products" className="text-red-600 hover:text-red-700 font-medium hidden md:inline-block">
              Xem tất cả →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((category) => (
                <Link 
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group bg-white rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="aspect-square bg-gradient-to-br from-red-50 to-orange-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                      {getCategoryIcon(category)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-center group-hover:text-red-600 transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="swiss-container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">SẢN PHẨM NỔI BẬT</h2>
          <Link to="/products" className="text-red-600 hover:text-red-700 font-medium hidden md:inline-block">
            Xem tất cả →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <article 
                key={product._id} 
                className="group hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden bg-white border border-gray-200"
              >
                <Link to={`/products/${product._id}`} className="block">
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                    {getProductImage(product) ? (
                      <img 
                        src={getProductImage(product)} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-gray-300 font-bold">
                          {product.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 text-xs font-bold shadow-lg rounded">
                      MỚI
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="space-y-2 px-4 pb-4 pt-3">
                    <p className="text-xs text-gray-600 tracking-wide uppercase">
                      {getProductCategoryName(product) || 'Văn phòng phẩm'}
                    </p>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-gray-600">
                        Còn {getProductStock(product)}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/products" className="btn-primary inline-block">
            XEM TẤT CẢ SẢN PHẨM
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 shadow-inner">
        <div className="swiss-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 text-gray-900">CHẤT LƯỢNG CAO</h3>
              <p className="text-xs text-gray-500">Sản phẩm chính hãng</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 text-gray-900">GIAO HÀNG NHANH</h3>
              <p className="text-xs text-gray-500">Xử lý trong 24h</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 text-gray-900">GIÁ CẢ HỢP LÝ</h3>
              <p className="text-xs text-gray-500">Giá tốt nhất thị trường</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 text-gray-900">HỖ TRỢ 24/7</h3>
              <p className="text-xs text-gray-500">Luôn sẵn sàng hỗ trợ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

