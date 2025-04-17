import React, { createContext, useContext, useState } from 'react';
import { CartContextType } from '../types';
import { CartItem } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [cartItems, setCartItems] = useState<CartItem[]>([]);
 
   const addToCart = (item: CartItem) => {
     setCartItems([...cartItems, item]);
   };

   const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };



  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};