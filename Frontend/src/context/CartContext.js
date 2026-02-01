import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch cart khi user đăng nhập
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setTotal(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        // API trả về items với product_id được populate
        // Transform để frontend sử dụng product thay vì product_id
        const transformedItems = (response.data.items || []).map(item => ({
          ...item,
          product: item.product_id, // Backend populate product_id
          _id: item._id || item.product_id?._id
        }));
        setCartItems(transformedItems);
        calculateTotals(transformedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items) => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = items.reduce((acc, item) => {
      const price = item.product?.price || item.product_id?.price || 0;
      return acc + price * item.quantity;
    }, 0);
    setCartCount(count);
    setTotal(totalAmount);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Thêm vào giỏ hàng thất bại' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Cập nhật giỏ hàng thất bại' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Xóa sản phẩm thất bại' };
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCartItems([]);
        setCartCount(0);
        setTotal(0);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Xóa giỏ hàng thất bại' };
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      total,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
