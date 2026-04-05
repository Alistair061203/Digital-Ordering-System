// src/components/OrderSummaryCards.jsx
import React from 'react';

const OrderSummaryCards = ({ orders, preparingCount, totalRevenue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Orders</h3>
        <p className="text-4xl font-black text-gray-800">{orders.length}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">In Preparation</h3>
        <p className="text-4xl font-black text-gray-800">{preparingCount}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Average Wait</h3>
        <p className="text-4xl font-black text-gray-800">14m</p>
        <p className="text-xs font-bold text-[#B84018] mt-2">~ Peak hour</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Revenue</h3>
        <p className="text-4xl font-black text-[#B84018]">
          ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default OrderSummaryCards;