// src/components/CartBar.jsx
import React from 'react';
import { ShoppingBag } from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { useNavigate, useParams } from 'react-router-dom';

function CartBar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const { restaurantName, tableNumber } = useParams();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/cart`)}
        className="max-w-md mx-auto w-full bg-pink-600 text-white flex items-center justify-between p-4 rounded-2xl shadow-2xl hover:bg-pink-700 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium opacity-90">{totalItems} {totalItems === 1 ? 'item' : 'items'} added</p>
            <p className="font-bold text-lg">View Cart</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm opacity-80 leading-none mb-1 text-xs">Total</p>
          <p className="text-xl font-black">₱{totalPrice.toFixed(2)}</p>
        </div>
      </button>
    </div>
  );
}

export default CartBar;