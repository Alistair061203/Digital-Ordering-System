// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const addToCart = (item, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCart((current) => current.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setSpecialInstructions('');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, specialInstructions, setSpecialInstructions }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);