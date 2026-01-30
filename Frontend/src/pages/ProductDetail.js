import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      if (response.success) {
        setProduct(response.data);
        
        // Fetch related products
        try {
          const relatedRes = await productService.getRelatedProducts(id, 4);
          if (relatedRes.success) {
            setRelatedProducts(relatedRes.data || []);
          }
        } catch (err) {
          console.error('Error fetching related products:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Đã thêm vào giỏ hàng!');
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock_quantity || product?.stockQuantity || 99)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  if (loading) {
    return (
      <div className="swiss-container py-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="col-span-12 md:col-span-5 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="swiss-container py-12 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="btn-primary">
          QUAY LẠI CỬA HÀNG
        </Link>
      </div>
    );
  }

  const stockQuantity = product.stock_quantity || product.stockQuantity || 0;
  const oldPrice = product.price * 1.5;
  const discount = Math.floor(Math.random() * 40) + 10;

  return (
    <div>
      <section className="swiss-container py-12">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Product Image */}
          <div className="col-span-12 md:col-span-7">
            <div className="sticky top-24">
              <div className="aspect-square bg-white rounded-lg mb-4 overflow-hidden border border-gray-200 shadow-lg">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl text-gray-300 font-bold">
                      {product.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="col-span-12 md:col-span-5">
            <div className="md:pl-8">
              
              {/* Category */}
              <p className="text-sm text-gray-600 mb-2 uppercase">
                {product.category?.name || 'Văn phòng phẩm'}
              </p>
              
              {/* Product Name */}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Price */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600">| Đã bán {Math.floor(Math.random() * 9000) + 100}</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(oldPrice)}
                  </span>
                  <span className="text-4xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded font-bold">
                    -{discount}%
                  </span>
                </div>
              </div>
              
              {/* Stock Status */}
              <div className="mb-8">
                {stockQuantity > 0 ? (
                  <div className="flex items-center space-x-3 bg-red-50 px-4 py-3 border-l-4 border-red-600 rounded">
                    <div className="w-3 h-3 bg-red-600 animate-pulse rounded-full"></div>
                    <span className="font-bold">CÒN HÀNG: {stockQuantity} {product.unit || 'sản phẩm'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 bg-gray-100 px-4 py-3 border-l-4 border-gray-400 rounded">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="font-bold text-gray-600">HẾT HÀNG</span>
                  </div>
                )}
              </div>
              
              {/* Add to Cart Form */}
              {user ? (
                stockQuantity > 0 && (
                  <div className="mb-8">
                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="font-bold mb-3 block tracking-wide">SỐ LƯỢNG</label>
                      <div className="flex items-center space-x-4">
                        <button 
                          type="button" 
                          onClick={decrementQuantity}
                          className="w-12 h-12 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-bold rounded"
                        >
                          −
                        </button>
                        <input 
                          type="number" 
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Math.min(stockQuantity, parseInt(e.target.value) || 1)))}
                          min="1" 
                          max={stockQuantity}
                          className="w-20 h-12 border-2 border-gray-900 text-center font-bold text-xl rounded"
                        />
                        <button 
                          type="button" 
                          onClick={incrementQuantity}
                          className="w-12 h-12 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-bold rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button onClick={handleAddToCart} className="btn-primary w-full h-14 text-lg">
                      THÊM VÀO GIỎ HÀNG
                    </button>
                  </div>
                )
              ) : (
                <div className="mb-8 p-6 border-2 border-gray-300 rounded-lg">
                  <p className="font-medium mb-4">Vui lòng đăng nhập để mua hàng</p>
                  <Link to="/login" className="btn-primary w-full inline-block text-center">
                    ĐĂNG NHẬP
                  </Link>
                </div>
              )}
              
              {/* Product Details */}
              <div className="mb-8 pb-8 border-b-2 border-gray-300">
                <h3 className="font-bold mb-4 tracking-wide">MÔ TẢ SẢN PHẨM</h3>
                <div className="text-gray-700 leading-relaxed">
                  {product.description || 'Sản phẩm văn phòng phẩm chất lượng cao, đáp ứng mọi nhu cầu làm việc và học tập.'}
                </div>
              </div>
              
              {/* Product Meta */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã sản phẩm:</span>
                  <span className="font-bold">{product.code || product._id?.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-bold">{product.category?.name || 'Văn phòng phẩm'}</span>
                </div>
                {product.supplier && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nhà cung cấp:</span>
                    <span className="font-bold">{product.supplier.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Đơn vị:</span>
                  <span className="font-bold">{product.unit || 'Cái'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-16 mt-24">
          <div className="swiss-container">
            <div className="mb-12">
              <h2 className="text-3xl font-bold">SẢN PHẨM LIÊN QUAN</h2>
              <div className="w-16 h-1 bg-red-600 mt-2"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((related) => (
                <article key={related._id} className="group">
                  <Link to={`/products/${related._id}`} className="block">
                    <div className="aspect-square bg-white mb-4 overflow-hidden rounded-lg border border-gray-200">
                      {related.image ? (
                        <img 
                          src={related.image}
                          alt={related.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <span className="text-6xl text-gray-300 font-bold">
                            {related.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-bold leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                        {related.name}
                      </h3>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-red-600">
                          {formatPrice(related.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
