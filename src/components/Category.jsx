// src/components/Category.jsx
import React from 'react';

function Category({ categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery }) {
  return (
    // This outer div handles the sticky behavior and makes sure everything inside is centered
    <div className="sticky top-[65px] z-40 flex justify-center px-4 py-4 w-full bg-neutral/90 backdrop-blur-md">
      
      {/* The Unified Beige Bar */}
      <div className="bg-[#F5F3ED] p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-sm border border-gray-200/50 max-w-full">

        {/* 1. Search Bar */}
        <div className="relative w-full md:w-64 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish, ingredients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-bold text-secondary placeholder-gray-400 shadow-sm transition-shadow"
          />
        </div>

        {/* 2. Categories */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1 w-full md:w-auto">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-secondary shadow-sm' // Active: White pill, dark text
                    : 'text-gray-500 hover:text-secondary'  // Inactive: Just text
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Category;