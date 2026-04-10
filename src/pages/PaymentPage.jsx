// src/pages/PaymentPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../connectDB';
import { ArrowLeft, Wallet, CreditCard, CheckCircle, Receipt } from 'lucide-react';

function PaymentPage() {
  const { restaurantName, tableNumber } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [status, setStatus] = useState('idle');
  // NEW: Saves the final total before the cart is cleared
  const [paidAmount, setPaidAmount] = useState(0);
  const navigate = useNavigate();

  const { cart, clearCart, specialInstructions } = useCart();

  // --- Synchronized Calculations (Matches CartPage) ---
  const subtotal = cart.reduce((sum, item) => {
    const itemCost = item.perItemTotal || Number(item.price);
    return sum + (itemCost * item.quantity);
  }, 0);

  const serviceCharge = subtotal * 0.05;
  const total = subtotal + serviceCharge;

  const handleSubmit = async () => {
    if (!cart.length) return;

    setStatus('submitted');

    try {
      const orderPayload = {
        table_number: tableNumber,
        total_price: total,
        status: 'Pending',
        payment_status: paymentMethod === 'cash' ? 'Unpaid' : 'Paid',
        // NEW: Add this line to actually save Cash vs Online to the database!
        payment_method: paymentMethod,
        is_active: true,
        special_instructions: specialInstructions || 'None',
        order_items: cart
      };

      const { error } = await supabase
        .from('ORDER_SAMPLE')
        .insert([orderPayload]);

      if (error) throw error;

      // NEW: Save the total right before clearing the cart
      setPaidAmount(total);

      setStatus('done');
      clearCart();

    } catch (error) {
      console.error("Error saving to database:", error.message);
      alert("Failed to send order. Please try again.");
      setStatus('idle');
    }
  };

  // --- SUCCESS STATE: Beautiful Order Confirmation ---
  if (status === 'done') {
    return (
      <div className="min-h-screen bg-neutral flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-secondary mb-2">Order Sent!</h2>
          <p className="text-gray-500 font-body mb-8">
            Your order has been sent to the kitchen.
            {paymentMethod === 'cash'
              ? " Please prepare cash for when the staff arrives."
              : " Your online payment was successful."}
          </p>

          <div className="bg-[#F5F3ED] w-full rounded-2xl p-6 mb-8 text-left">
            <div className="flex justify-between text-sm text-gray-500 font-bold mb-2 uppercase tracking-widest">
              <span>Table {tableNumber}</span>
              <span>Pending</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-headline font-bold text-secondary text-lg">Total Paid</span>
              {/* UPDATED: Now uses the frozen paidAmount */}
              <span className="font-headline font-extrabold text-2xl text-secondary">₱{paidAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/menu`)}
            className="w-full bg-secondary text-white font-headline font-bold py-4 rounded-2xl hover:bg-secondary/90 transition-all shadow-md active:scale-95"
          >
            Start a New Order
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN PAYMENT UI ---
  return (
    <div className="min-h-screen bg-neutral pb-24 animate-fade-in">

      {/* Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm px-4 md:px-8 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/cart`)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-50 text-secondary transition-colors flex items-center gap-2 font-bold text-sm"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:block">Back to Cart</span>
          </button>
          <h1 className="text-xl md:text-2xl font-headline font-extrabold text-secondary absolute left-1/2 -translate-x-1/2">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">

        {/* Payment Methods */}
        <h2 className="text-2xl font-headline font-extrabold text-secondary mb-4">Payment Method</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${paymentMethod === 'cash'
                ? 'border-secondary bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            onClick={() => setPaymentMethod('cash')}
          >
            <Wallet size={32} strokeWidth={2} className="mb-3" />
            <span className="font-headline font-bold text-lg tracking-wide">Pay at Counter</span>
            <span className={`text-sm mt-1 ${paymentMethod === 'cash' ? 'text-white/70' : 'text-gray-400'}`}>Cash or physical card</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${paymentMethod === 'online'
                ? 'border-secondary bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            onClick={() => setPaymentMethod('online')}
          >
            <CreditCard size={32} strokeWidth={2} className="mb-3" />
            <span className="font-headline font-bold text-lg tracking-wide">Pay Online</span>
            <span className={`text-sm mt-1 ${paymentMethod === 'online' ? 'text-white/70' : 'text-gray-400'}`}>GCash, Maya, or Card</span>
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="bg-[#F5F3ED] rounded-[2rem] p-6 md:p-8 border border-gray-200/50 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200/70 pb-4">
            <Receipt className="text-secondary" />
            <h2 className="text-xl font-headline font-extrabold text-secondary">Final Summary</h2>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 font-body">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start font-body">
                    <div>
                      <p className="font-bold text-secondary">{item.quantity}x {item.name}</p>
                    </div>
                    <p className="font-bold text-secondary">₱{((item.perItemTotal || item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 font-body text-sm text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Service Charge (5%)</span>
                  <span>₱{serviceCharge.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                <span className="font-headline font-bold text-gray-500">Total to Pay</span>
                <span className="font-headline font-extrabold text-3xl text-secondary">₱{total.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={status === 'submitted' || !cart.length}
          onClick={handleSubmit}
          className="w-full py-5 rounded-2xl text-white font-headline font-extrabold text-lg tracking-wide bg-secondary disabled:bg-gray-300 disabled:text-gray-500 transition-all active:scale-95 shadow-lg flex justify-center items-center gap-3"
        >
          {status === 'idle' && (
            <>
              Confirm & Pay ₱{total.toFixed(2)}
              <CheckCircle size={20} />
            </>
          )}
          {status === 'submitted' && 'Processing Order...'}
        </button>

      </div>
    </div>
  );
}

export default PaymentPage;