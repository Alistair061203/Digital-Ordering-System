// src/components/AdminMenuHeader.jsx
import React from 'react';
import { Plus } from 'lucide-react';

function AdminMenuHeader({ restaurant, onAddClick }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-secondary">
              Menu Management
            </h1>
            <p className="text-gray-500 mt-1 font-body">
              {restaurant?.name || 'Restaurant'}
            </p>
          </div>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-md"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminMenuHeader;
