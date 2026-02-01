import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Helper function to calculate cart totals
  const calculateTotals = useCallback((items) => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = items.reduce((acc, item) => acc + (item.product_id?.price || item.product?.price || item.price || 0) * item.quantity, 0);
    setCartCount(count);
    setTotal(totalAmount);
  }, []);

  // Fetch cart function
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        const items = response.data.items || [];
        setCartItems(items);
        calculateTotals(items);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateTotals]);

  // Fetch cart when user logs in - only runs when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setTotal(0);
    }
  }, [user]); // Remove fetchCart from dependencies to prevent infinite loop

  const addToCart = useCallback(async (productId, quantity = 1) => {
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
  }, [fetchCart]);

  const updateCartItem = useCallback(async (itemId, quantity) => {
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
  }, [fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
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
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
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
  }, []);

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
