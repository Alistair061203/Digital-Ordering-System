import React from 'react';
import AddToCart from '../src/components/AddToCart';

function CartPage({ cart, setCart }) {
  return <AddToCart cart={cart} setCart={setCart} />;
}

export default CartPage;
