import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '/src/connectDB';

function MenuPage({ restaurant }) {
  const { restaurantName, tableNumber } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant) {
      fetchMenu();
    }
  }, [restaurant]);

  async function fetchMenu() {
    setLoading(true);
    const { data, error } = await supabase
      .from('MENU_SAMPLE')
      .select('*')
      .eq('restaurant_id', restaurant.id);

    if (error) {
      console.error("Error fetching menu:", error);
    } else {
      setMenuItems(data);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-red-600 text-white p-6 shadow-md text-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          {restaurant?.name || "BULLEYEORG"}
        </h1>
        <p className="text-sm opacity-80">{restaurant?.address || "Loading address..."}</p>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {/* Table Indicator */}
        <div className="bg-white border-2 border-red-500 p-4 rounded-2xl shadow-sm text-center mb-8">
          <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Ordering from</p>
          <h2 className="text-5xl font-black text-red-600">TABLE {tableNumber}</h2>
        </div>

        {/* Menu Section Placeholder */}
        <section>
          <h3 className="text-xl font-bold border-b-2 border-black pb-1 mb-4">MENU</h3>
          {loading ? (
            <p className="text-center text-gray-400 animate-pulse">Loading delicious food...</p>
          ) : (
            <div className="grid gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-contain rounded-lg bg-black mb-2" />
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-red-600 font-semibold">₱{item.price}</p>
                  </div>
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">
                    ADD +
                  </button>
                </div>
              ))}
            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default MenuPage;