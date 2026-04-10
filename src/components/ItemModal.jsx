// src/components/ItemModal.jsx
import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

function ItemModal({ item, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Safely calculate total for the button display
  const basePrice = item?.price ? Number(item.price) : 0;
  const totalPrice = (basePrice * quantity).toFixed(2);

  return (
    // Backdrop with premium blur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/40 backdrop-blur-sm p-4 md:p-6 transition-opacity">
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Modal Container: Side-by-side on desktop (md:flex-row) */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh]">

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:left-4 md:right-auto bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-md z-10 text-secondary hover:bg-white transition-all hover:scale-105"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* LEFT SIDE: Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[300px] bg-[#F5F3ED] relative flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100">
          {item?.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-body font-medium">
              No Image Available
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-neutral-surface/50 no-scrollbar">
          
          {/* Header & Price */}
          <div className="mb-4">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-secondary leading-tight mb-2">
              {item.name}
            </h2>
            <span className="font-bold text-secondary bg-gray-100 px-3 py-1.5 rounded-lg text-xl md:text-2xl tracking-tight inline-block">
              ₱{basePrice.toFixed(2)}
            </span>
          </div>

          {/* Description (flex-grow pushes the buttons down) */}
          <p className="text-gray-500 font-body text-base md:text-lg leading-relaxed mt-2 mb-8 flex-grow">
            {item.description || "Freshly prepared with the finest ingredients. A perfect choice to satisfy your cravings."}
          </p>

          {/* BOTTOM AREA: Stacked Quantity and Button */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
            
            {/* Quantity Controls - Full width, centered layout */}
            <div className="flex items-center justify-between border-2 border-gray-100/70 rounded-2xl p-2 bg-[#F5F3ED] w-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-white hover:shadow-sm rounded-xl transition-all active:scale-95 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={20} className="text-secondary" strokeWidth={3} />
              </button>

              <span className="font-headline font-extrabold text-2xl text-secondary">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center bg-white hover:shadow-sm rounded-xl transition-all active:scale-95"
              >
                <Plus size={20} className="text-secondary" strokeWidth={3} />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full flex items-center justify-between px-6 bg-secondary hover:bg-secondary/90 text-white font-headline font-extrabold py-5 rounded-2xl transition-all active:scale-95 shadow-md group tracking-wide text-lg"
              onClick={() => {
                addToCart(item, quantity);
                onClose();
              }}
            >
              <span>Add to Order</span>
              <span className="bg-white/20 px-4 py-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                ₱{totalPrice}
              </span>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;