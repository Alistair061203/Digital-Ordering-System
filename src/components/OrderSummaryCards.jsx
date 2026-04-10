// src/components/OrderSummaryCards.jsx
import React from 'react';
import { Receipt, ChefHat, Wallet } from 'lucide-react';

const OrderSummaryCards = ({ orders, preparingCount, totalRevenue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* 1. Active Queue Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm hover:shadow-md border border-gray-100 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Active Queue</h3>
          <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-100 transition-colors">
            <Receipt size={20} strokeWidth={2.5} />
          </div>
        </div>
        <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter relative z-10">
          {orders.length}
        </p>
      </div>

      {/* 2. In Preparation Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm hover:shadow-md border border-gray-100 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-[10px] sm:text-xs font-black text-[#b23a2f] uppercase tracking-[0.2em]">Now Cooking</h3>
          <div className="p-2.5 bg-[#fff2ee] rounded-xl text-[#b23a2f] group-hover:scale-110 transition-transform">
            <ChefHat size={20} strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-end gap-3 relative z-10">
          <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">
            {preparingCount}
          </p>
          <span className="text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Tickets</span>
        </div>
      </div>

      {/* 3. Total Revenue Card (Highlighted with Brand Color) */}
      <div className="bg-[#b23a2f] p-6 sm:p-8 rounded-[2rem] shadow-lg shadow-[#b23a2f]/20 border border-[#963526] transition-all group relative overflow-hidden">
        {/* Subtle glowing background element */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors"></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-[10px] sm:text-xs font-black text-white/80 uppercase tracking-[0.2em]">Today's Revenue</h3>
          <div className="p-2.5 bg-white/10 rounded-xl text-white backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            <Wallet size={20} strokeWidth={2.5} />
          </div>
        </div>
        <div className="relative z-10">
          <span className="text-sm font-bold text-white/70 mr-1 tracking-widest">PHP</span>
          <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter inline-block">
            {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

    </div>
  );
};

export default OrderSummaryCards;