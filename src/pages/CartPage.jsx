// src/pages/CartPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCart from '../components/AddToCart';
import { useCart } from '../context/CartContext'; // 1. Import the hook

function CartPage() {
  const { restaurantName, tableNumber } = useParams();
  const navigate = useNavigate();
  const { cart } = useCart(); // 2. Get the cart from context

  return (
    <div>
      {/* 3. No more props needed here! */}
      <AddToCart /> 
      
      <div className="max-w-3xl mx-auto p-4">
        <button
          onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/payment`)}
          className="w-full py-3 mt-3 text-white bg-red-600 rounded-xl font-bold disabled:bg-gray-300"
          disabled={cart.length === 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default CartPage;