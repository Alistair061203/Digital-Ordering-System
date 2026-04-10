// src/pages/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '/src/connectDB';
import Category from '../components/Category';
import MenuCard from '../components/MenuCard';
import ItemModal from '../components/ItemModal';
import CartBar from '../components/CartBar';

function MenuPage({ restaurant }) {
  const { restaurantName, tableNumber } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for our new Search & Category bar
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // NEW: Search state
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Dishes' }]);
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

  // UPDATED: Now filters by both Category AND Search text
  const displayedItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category_id === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral pb-24">
      {/* Pass down the new search props alongside the category props */}
      <Category
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />


      <main className="p-4 max-w-md mx-auto md:max-w-5xl">
        <section>
          {loading ? (
            <p className="text-center text-gray-400 animate-pulse mt-8">Loading kitchen...</p>
          ) : (
            <>
              {displayedItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
                  No dishes found for your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {displayedItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onAddToCart={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <CartBar />

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