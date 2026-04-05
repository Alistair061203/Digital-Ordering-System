// src/components/MenuCard.jsx
import React from 'react';

function MenuCard({ item, onAddToCart }) {
  return (
    <button
      onClick={() => onAddToCart(item)}
      className="text-left w-full transition-transform active:scale-[0.98] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
    >
      {item.image_url && (
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-full h-48 object-cover bg-gray-100" 
        />
      )}

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mt-auto">
          <h4 className="font-bold text-lg text-neutral mb-1">{item.name}</h4>
          <p className="text-secondary font-black text-lg">₱{item.price}</p>
        </div>

        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
}

export default MenuCard;