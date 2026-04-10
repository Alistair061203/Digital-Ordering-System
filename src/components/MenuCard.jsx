// src/components/MenuCard.jsx
import React from 'react';

function MenuCard({ item, onAddToCart }) {
  // Fallback to ensure price doesn't break if it's missing
  const price = item?.price ? Number(item.price).toFixed(2) : "0.00";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300 flex flex-col h-full">
      
      {/* 1. Image Container with Hover Zoom */}
      <div className="relative h-48 w-full overflow-hidden bg-[#F5F3ED]">
        {item?.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Hides the broken image icon if the link is bad
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback pattern if no image exists or it fails to load */}
        <div className={`w-full h-full items-center justify-center text-gray-300 ${item?.image_url ? 'hidden' : 'flex'}`}>
          <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Title and Price Row */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-headline font-extrabold text-secondary text-lg leading-tight group-hover:text-primary transition-colors">
            {item?.name || "Unnamed Dish"}
          </h3>
          <span className="font-bold text-secondary bg-gray-50 px-2 py-1 rounded-md text-sm whitespace-nowrap border border-gray-100">
            ₱{price}
          </span>
        </div>
        
        {/* Description (Truncated to 2 lines so cards stay the same height) */}
        <p className="text-gray-500 text-sm font-body line-clamp-2 mb-6 flex-grow">
          {item?.description || "No description available for this item."}
        </p>

        {/* 3. Minimalist Action Button */}
        <button
          onClick={onAddToCart}
          className="w-full mt-auto py-3 rounded-xl border-2 border-gray-100 font-bold text-secondary text-sm hover:border-primary hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add to Order
        </button>
      </div>
    </div>
  );
}

export default MenuCard;