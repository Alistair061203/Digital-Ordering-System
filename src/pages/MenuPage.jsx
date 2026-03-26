// src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '/src/connectDB';
import Category from '../components/Category';
import MenuCard from '../components/MenuCard';
import ItemModal from '../components/ItemModal'; // 1. Import the new modal

function MenuPage({ restaurant }) {
  const { restaurantName, tableNumber } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Dishes' }]);

  // 2. State for the Popup
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (restaurant) {
      fetchMenu();
      fetchCategories();
    }
  }, [restaurant]);

  async function fetchCategories() {
    const { data, error } = await supabase.from('MENU_CATEGORY').select('id, name');
    if (error) console.error("Error fetching categories:", error);
    else if (data) setCategories([{ id: 'all', name: 'All Dishes' }, ...data]);
  }

  async function fetchMenu() {
    setLoading(true);
    const { data, error } = await supabase
      .from('MENU_ITEM')
      .select('*')
      .eq('restaurant_id', restaurant.id);
    if (error) console.error("Error fetching menu:", error);
    else setMenuItems(data);
    setLoading(false);
  }

  const displayedItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Category
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="p-4 max-w-md mx-auto md:max-w-5xl">
        <section>
          {loading ? (
            <p className="text-center text-gray-400 animate-pulse mt-8">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedItems.map((item) => (
                <MenuCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={() => setSelectedItem(item)} 
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedItem && (
        <ItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

export default MenuPage;