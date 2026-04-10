// src/components/CartBar.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

function CartBar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const { restaurantName, tableNumber } = useParams();

  // 1. Automatically hide the bar if the cart is empty
  if (!cart || cart.length === 0) return null;

  // 2. Calculate totals based on the items in the cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce((sum, item) => {
    // Falls back to regular price if perItemTotal wasn't set in ItemModal
    const itemCost = item.perItemTotal || Number(item.price);
    return sum + (itemCost * item.quantity);
  }, 0);

  return (
    // Fixed wrapper to float at the bottom of the screen
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none flex justify-center animate-in slide-in-from-bottom-8 duration-500">
      
      {/* The clickable pill - pointer-events-auto makes it clickable 
        despite the wrapper being invisible to clicks 
      */}
      <div className="w-full max-w-4xl pointer-events-auto">
        <button
          onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/cart`)}
          className="w-full bg-secondary text-white shadow-2xl shadow-secondary/30 rounded-3xl p-4 md:p-5 flex items-center justify-between hover:bg-secondary/95 transition-all active:scale-[0.98] group border border-white/10"
        >
          
          {/* LEFT SIDE: Bag Icon & Item Count */}
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3.5 rounded-2xl relative group-hover:bg-white/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-secondary shadow-sm">
                {totalItems}
              </span>
            </div>
            <span className="hidden sm:block font-headline font-extrabold text-lg md:text-xl tracking-wide">
              View Your Order
            </span>
          </div>

          {/* RIGHT SIDE: Total Price & Arrow */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end">
              <span className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5">
                Total
              </span>
              <span className="font-headline font-extrabold text-xl md:text-2xl">
                ₱{totalPrice.toFixed(2)}
              </span>
            </div>
            
            {/* Forward Arrow with hover animation */}
            <div className="bg-white text-secondary p-3 rounded-2xl group-hover:translate-x-1 group-hover:shadow-md transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

        </button>
      </div>
    </div>
  );
}

export default CartBar;