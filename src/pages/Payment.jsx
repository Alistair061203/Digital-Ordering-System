import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PaymentPage({ cart, setCart }) {
  const { restaurantName, tableNumber } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = () => {
    if (!cart.length) {
      return;
    }

    setStatus('submitted');

    // This is a mock submission. Replace with your real API/DB call as needed.
    // Example: update Supabase PAYMENT table with status = 'Cash' | 'Gcash' etc.

    setTimeout(() => {
      setStatus('done');
      setCart([]); // Clear cart after payment choice
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-black mb-4">Secure Checkout</h1>
        <p className="text-gray-600 mb-4">{restaurantName} · Table {tableNumber}</p>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">No items in the cart.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4 p-4 rounded-xl bg-gray-100">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
        <div className="flex gap-2 flex-wrap mb-5">
          <button
            className={`px-4 py-2 rounded-lg border ${paymentMethod === 'cash' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setPaymentMethod('cash')}
          >
            Pay at Counter (Cash)
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${paymentMethod === 'online' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setPaymentMethod('online')}
          >
            Pay Online 
          </button>
        </div>


        <button
          disabled={status === 'submitted' || !cart.length}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl text-white bg-red-600 disabled:bg-gray-300 disabled:text-gray-600"
        >
          {status === 'idle' && 'Confirm Payment'}
          {status === 'submitted' && 'Processing...'}
          {status === 'done' && 'Payment Recorded'}
        </button>

        {status === 'done' && (
          <div className="mt-4 p-4 rounded-lg bg-green-100 text-green-800">
            Payment method <strong>{paymentMethod === 'cash' ? 'Cash (Pay at Counter)' : 'Online'}</strong> received.
            <br />
            Your order is now <strong>Pending</strong>. Staff will handle it shortly.
            <button
              onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/menu`)}
              className="mt-3 block px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
