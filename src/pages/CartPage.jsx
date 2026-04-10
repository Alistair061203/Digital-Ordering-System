// src/pages/CartPage.jsx
import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { restaurantName, tableNumber } = useParams();

  // --- Calculations ---
  const subtotal = cart.reduce((sum, item) => {
    const itemCost = item.perItemTotal || Number(item.price);
    return sum + (itemCost * item.quantity);
  }, 0);

  // Let's add a standard 5% service charge for that realistic restaurant feel
  const serviceCharge = subtotal * 0.05; 
  const total = subtotal + serviceCharge;

  // --- Empty State ---
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-[#F5F3ED] rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-headline font-extrabold text-secondary mb-3">Your order is empty</h2>
        <p className="text-gray-500 font-body mb-8 max-w-sm">
          Looks like you haven't added anything to your table yet. Let's explore the menu!
        </p>
        <button 
          onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/menu`)}
          className="bg-secondary text-white font-headline font-bold px-8 py-4 rounded-2xl hover:bg-secondary/90 transition-all shadow-md active:scale-95"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // --- Populated Cart State ---
  return (
    <div className="min-h-screen bg-neutral pb-24 animate-fade-in">
      
      {/* 1. Header Area */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/menu`)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-50 text-secondary transition-colors flex items-center gap-2 font-bold text-sm"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:block">Back to Menu</span>
          </button>
          <h1 className="text-xl md:text-2xl font-headline font-extrabold text-secondary absolute left-1/2 -translate-x-1/2">
            Your Order
          </h1>
          <div className="font-bold text-xs text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            Table {tableNumber}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* 2. LEFT SIDE: Cart Items List */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 relative group transition-all hover:shadow-md">
              
              {/* Delete Button (Top Right absolute) */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
              >
                <Trash2 size={18} />
              </button>

              {/* Item Image */}
              <div className="w-full sm:w-32 h-32 bg-[#F5F3ED] rounded-2xl overflow-hidden flex-shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold uppercase">No Image</div>
                )}
              </div>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-headline font-extrabold text-lg text-secondary pr-10 mb-1">{item.name}</h3>
                
                {/* Dynamically show selections if they exist from ItemModal */}
                {item.selections && (
                  <div className="text-sm font-body text-gray-500 mb-3 space-y-0.5">
                    {item.selections.side && <p>• {item.selections.side}</p>}
                    {item.selections.extras?.map(ext => <p key={ext}>• + {ext}</p>)}
                    {item.selections.request && <p className="italic text-gray-400 mt-1">"{item.selections.request}"</p>}
                  </div>
                )}
                
                {/* Quantity & Price Row */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-bold text-lg text-secondary">
                    ₱{((item.perItemTotal || item.price) * item.quantity).toFixed(2)}
                  </span>
                  
                  {/* Quantity Pill */}
                  <div className="flex items-center bg-[#F5F3ED] border-2 border-gray-100/50 rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-secondary hover:text-primary transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-10 text-center font-headline font-bold text-secondary">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-secondary hover:text-primary transition-colors"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* 3. RIGHT SIDE: Order Summary (Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-[#F5F3ED] p-6 md:p-8 rounded-[2rem] border border-gray-200/50 shadow-sm sticky top-28">
            <h3 className="font-headline font-extrabold text-xl text-secondary mb-6 border-b border-gray-200/50 pb-4">
              Order Summary
            </h3>
            
            <div className="space-y-4 font-body text-secondary mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Subtotal ({cart.length} items)</span>
                <span className="font-bold">₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Service Charge (5%)</span>
                <span className="font-bold">₱{serviceCharge.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200/50 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-headline font-bold text-gray-500">Total</span>
                <div className="text-right">
                  <span className="text-sm text-gray-400 block mb-1 font-medium tracking-wide">PHP</span>
                  <span className="font-headline font-extrabold text-4xl text-secondary">₱{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/payment`)}
              className="w-full bg-secondary text-white font-headline font-extrabold text-lg py-5 rounded-2xl hover:bg-secondary/90 transition-all shadow-lg active:scale-95 tracking-wide flex justify-center items-center gap-3"
            >
              Proceed to Payment
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default CartPage;