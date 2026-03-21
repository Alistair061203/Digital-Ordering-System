// DisplayRestaurant.jsx
import React from 'react';

function DisplayRestaurant({ restaurants }) {

  if (!restaurants || restaurants.length === 0) {
    return <p className="text-center text-gray-500">No restaurants found...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {restaurants.map((item) => (
          <div key={item.id} className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="text-orange-500">📍</span> {item.address}
            </p>

            <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600">
              View Menu
            </button>
          </div>
        ))}

      </div>
    </div >
  );
}

export default DisplayRestaurant;