// src/components/ItemModal.jsx
import React, { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

function ItemModal({ item, onClose }) {
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg z-10"
        >
          <X size={20} />
        </button>

        <div className="w-full h-64 bg-gray-200">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>

          <div className="mb-4">
            <span className="text-pink-600 font-bold text-xl">₱{item.price.toFixed(2)}</span>
          </div>

          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            {item.description || "Freshly prepared with the finest ingredients."}
          </p>

          <div className="flex items-center gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center border-2 border-gray-100 rounded-full p-1 bg-gray-50/50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all active:scale-90"
              >
                <Minus size={20} className="text-gray-400" />
              </button>

              <span className="w-8 text-center font-bold text-lg">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all active:scale-90"
              >
                <Plus size={20} className="text-gray-400" />
              </button>
            </div>

            {/* 2. Now addToCart is defined and ready to use here */}
            <button
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-pink-200"
              onClick={() => {
                addToCart(item, quantity);
                onClose();
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;