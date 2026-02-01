import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);
  
  // Debug user data
  React.useEffect(() => {
    if (user) {
      console.log('=== HEADER DEBUG ===');
      console.log('User object:', user);
      console.log('User role_id:', user.role_id);
      console.log('Is admin?:', user.role_id === 'admin');
      console.log('=== END HEADER DEBUG ===');
    }
  }, [user]);

  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-red-600 sticky top-0 z-50 shadow-lg">
      <div className="swiss-container">
        {/* Top Bar */}
        <div className="py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-red-600 font-bold text-xl">VPP</span>
              </div>
              <div className="hidden lg:block">
                <div className="text-xl font-bold tracking-tight leading-none text-white">VPP ONLINE</div>
                <div className="text-xs tracking-wide text-red-100">Hệ thống Văn phòng phẩm Online</div>
              </div>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-4 py-3 border-0 focus:ring-2 focus:ring-white transition-all duration-200 font-medium text-gray-900 placeholder-gray-500 rounded-lg"
                  />
                  <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {user ? (
                <>
                  {/* Cart */}
                  <Link to="/cart" className="relative group">
                    <div className="w-10 h-10 bg-white flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 shadow-md rounded">
                      <svg className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                    </div>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-red-600 animate-pulse text-xs font-bold flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-10 h-10 bg-white flex items-center justify-center hover:bg-red-700 transition-all rounded group"
                    >
                      <svg className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-gray-900 shadow-xl z-50 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <div className="font-bold text-gray-900">{user.full_name || user.username || user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          {(user.role_id === 'admin' || user.email === 'long@gmail.com') && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">👑 Admin</span>
                          )}
                          {user.role_id === 'customer' && user.email !== 'long@gmail.com' && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">👤 Khách hàng</span>
                          )}
                        </div>
                        <div className="py-2">
                          <Link 
                            to="/orders" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            Đơn hàng của tôi
                          </Link>
                          <Link 
                            to="/cart"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            Giỏ hàng
                          </Link>
                          
                          {/* Menu admin */}
                          {(user.role_id === 'admin' || user.email === 'long@gmail.com') && (
                            <>
                              <div className="border-t border-gray-200 my-2"></div>
                              <Link 
                                to="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                👑 Quản lý
                              </Link>
                            </>
                          )}
                        </div>
                        <div className="border-t border-gray-200">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="hidden sm:inline-block px-5 py-2.5 text-white font-semibold text-sm border-2 border-white rounded-lg hover:bg-white hover:text-red-600 transition-all duration-300"
                  >
                    ĐĂNG NHẬP
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 bg-white text-red-600 font-bold text-sm rounded-lg hover:bg-yellow-400 hover:text-red-700 hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    ĐĂNG KÝ
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 border-2 border-white flex items-center justify-center rounded text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 focus:border-red-600 focus:ring-0 transition-all duration-200 font-medium text-gray-900 placeholder-gray-500 shadow-md rounded-lg"
              />
              <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-8 mt-4 pt-4 border-t border-red-500">
            <Link to="/" className="text-white font-medium hover:text-yellow-300 transition-colors">
              TRANG CHỦ
            </Link>
            <Link to="/products" className="text-white font-medium hover:text-yellow-300 transition-colors">
              SẢN PHẨM
            </Link>
            <Link to="/about" className="text-white font-medium hover:text-yellow-300 transition-colors">
              GIỚI THIỆU
            </Link>
            <Link to="/contact" className="text-white font-medium hover:text-yellow-300 transition-colors">
              LIÊN HỆ
            </Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-red-500 pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-white font-medium hover:text-yellow-300 transition-colors py-2"
              >
                TRANG CHỦ
              </Link>
              <Link 
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="text-white font-medium hover:text-yellow-300 transition-colors py-2"
              >
                SẢN PHẨM
              </Link>
              <Link 
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-white font-medium hover:text-yellow-300 transition-colors py-2"
              >
                GIỚI THIỆU
              </Link>
              <Link 
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-white font-medium hover:text-yellow-300 transition-colors py-2"
              >
                LIÊN HỆ
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

