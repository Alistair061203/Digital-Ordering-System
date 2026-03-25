import React from 'react';

const AddToCart = ({ cart, setCart }) => {
  const updateQuantity = (itemId, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (itemId) => {
    setCart((current) => current.filter((item) => item.id !== itemId));
  };

  const [specialInstruction, setSpecialInstruction] = React.useState('');
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
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-100 rounded">-</button>
                    <span className="px-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-100 rounded">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-sm font-bold text-red-600">Remove</button>
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
            <hr />
            <div className="flex justify-between text-2xl font-black">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1" htmlFor="special-instruction">
              Special Instructions
            </label>
            <textarea
              id="special-instruction"
              value={specialInstruction}
              onChange={(e) => setSpecialInstruction(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-red-500"
              rows={3}
              placeholder="No onions, extra sauce, allergies, etc."
            />
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => {
              console.log('Order placed:', { cart, specialInstruction, total });
              alert('Your order is placed! Special instructions saved.');
            }}
            className="w-full mt-5 py-3 rounded-xl text-white font-bold bg-red-600 disabled:bg-gray-300"
          >
            Place Your Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
