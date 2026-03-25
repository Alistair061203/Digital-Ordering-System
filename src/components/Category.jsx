// src/components/Category.jsx
import React from 'react';

function Category({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-[65px] z-40">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        
        {/* We map over the objects now */}
        {categories.map((category) => (
          <button
            key={category.id} // Use the real database ID as the key!
            onClick={() => setActiveCategory(category.id)} // Set the active ID when clicked
            className={`px-6 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all duration-200 ${
              activeCategory === category.id // Check against the ID
                ? 'bg-secondary text-white shadow-md'
                : 'bg-tertiary text-neutral opacity-80 hover:opacity-100'
            }`}
          >
            {category.name} {/* Display the actual text name */}
          </button>
        ))}
        
      </div>
    </div>
  );
}

export default Category;