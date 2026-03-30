import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCart from '../components/AddToCart';

function CartPage({ cart, setCart }) {
  const { restaurantName, tableNumber } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <AddToCart cart={cart} setCart={setCart} />
      <div className="max-w-3xl mx-auto p-4">
        <button
          onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/payment`)}
          className="w-full py-3 mt-3 text-white bg-red-600 rounded-xl font-bold"
          disabled={cart.length === 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default CartPage;
