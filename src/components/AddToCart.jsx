// src/components/AddToCart.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // 1. Import the hook

const AddToCart = () => {
  // 2. Pull everything you need directly from the Context!
  const { cart, updateQuantity, removeItem } = useCart();
  
  const [specialInstruction, setSpecialInstruction] = useState('');
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Number(subtotal.toFixed(2));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-red-600 text-white p-6">
          <h1 className="text-3xl font-black">Review Your Order</h1>
          <p className="text-sm opacity-80 mt-1">Carefully curated selections for your dining experience.</p>
        </div>

        <div className="p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty. Add something from the menu.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100 items-center">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <p className="text-red-600 font-semibold">₱{item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {/* These buttons now trigger the Context functions automatically */}
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors">-</button>
                    <span className="px-2 font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors">Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-100 p-6">
          <h3 className="text-xl font-bold mb-3">Order Total</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between text-2xl font-black text-gray-900">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2" htmlFor="special-instruction">
              Special Instructions
            </label>
            <textarea
              id="special-instruction"
              value={specialInstruction}
              onChange={(e) => setSpecialInstruction(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              rows={3}
              placeholder="No onions, extra sauce, allergies, etc."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;