// src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '/src/connectDB';
import Category from '../components/Category';
// 1. Import your new component


function MenuPage({ restaurant }) {
  const { restaurantName, tableNumber } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Dishes');
  const [categories, setCategories] = useState(['All Dishes']);

  useEffect(() => {
    if (restaurant) {
      fetchMenu();
      fetchCategories();
    }
  }, [restaurant]);

  async function fetchCategories() {
    const { data, error } = await supabase.from('MENU_CATEGORY').select('name');
    if (error) {
      console.error("Error fetching categories:", error);
    } else if (data) {
      const fetchedNames = data.map(category => category.name);
      setCategories(['All Dishes', ...fetchedNames]);
    }
  }

  async function fetchMenu() {
    setLoading(true);
    const { data, error } = await supabase
      .from('MENU_ITEM')
      .select('*')
      .eq('restaurant_id', restaurant.id);

    if (error) {
      console.error("Error fetching menu:", error);
    } else {
      setMenuItems(data);
    }
    setLoading(false);
  }

  const displayedItems = activeCategory === 'All Dishes'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Category
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="p-4 max-w-md mx-auto">
        <section>
          {loading ? (
            <p className="text-center text-gray-400 animate-pulse mt-8">Loading delicious food...</p>
          ) : (
            <div className="grid gap-6">

              {displayedItems.map((item) => (
                <button onClick={() => console.log('added to cart', item.name)} key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">

                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover bg-gray-100" />
                  )}

                  <div className="p-5 flex flex-col flex-grow">
                    
                    <div className="flex justify-between items-center mt-auto">
                      <h4 className="font-bold text-lg text-neutral mb-1">{item.name}</h4>
                      <p className="text-secondary font-black text-lg">₱{item.price}</p>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </button>
              ))}

              {displayedItems.length === 0 && (
                <div className="text-center text-gray-500 mt-8 py-8">
                  No items found in {activeCategory}.
                </div>
              )}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MenuPage;