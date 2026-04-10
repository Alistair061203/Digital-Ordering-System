// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [tableNumber, setTableNumber] = useState('');
  const navigate = useNavigate();
  
  // For this setup, we'll assume a default restaurant name. 
  // In a real app, this might come from the QR code's URL!
  const restaurantName = "May'sFoodies";

  const handleEnterMenu = (e) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      // This perfectly matches the route structure we used in your other pages!
      navigate(`/${restaurantName}/table/${tableNumber}/menu`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Elements for that high-end feel */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#EBE7E0] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#EBE7E0] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-md z-10 flex flex-col items-center animate-fade-in">
        
        {/* Restaurant Logo / Branding Area */}
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-8 shadow-xl shadow-secondary/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-headline font-black text-secondary text-center leading-tight mb-4 tracking-tight">
          Welcome to <br /> {restaurantName}
        </h1>
        
        <p className="text-gray-500 font-body text-center mb-10 text-lg">
          Scan your table's QR code or enter your table number below to view our curated menu.
        </p>

        {/* Table Entry Form */}
        <form onSubmit={handleEnterMenu} className="w-full bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100">
          
          <div className="mb-6">
            <label htmlFor="tableNumber" className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
              Enter Table Number
            </label>
            <input
              type="number"
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. 12"
              className="w-full text-center text-4xl font-headline font-black text-secondary bg-[#F5F3ED] rounded-2xl py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder-gray-300"
              required
              min="1"
            />
          </div>

          <button
            type="submit"
            disabled={!tableNumber.trim()}
            className="w-full bg-secondary text-white font-headline font-bold text-lg py-5 rounded-2xl hover:bg-secondary/90 transition-all active:scale-95 shadow-md disabled:bg-gray-200 disabled:text-gray-400 flex justify-center items-center gap-3"
          >
            View Menu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

      </div>
    </div>
  );
}

export default LandingPage;