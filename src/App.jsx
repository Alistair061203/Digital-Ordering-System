// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './connectDB';
import MenuPage from './pages/MenuPage';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderPage from './pages/OrderPage';
import ArchivedPage from './pages/ArchivedPage';
import './App.css';

function App() {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    async function getRestaurant() {
      // 1. Get the restaurant name from the URL path (e.g., /MaysFoodies/table/1/menu)
      const pathParts = window.location.pathname.split('/');
      const currentResName = pathParts[1];

      // 2. Only fetch if there's a name in the URL and it's not a generic route
      if (currentResName && currentResName !== "OrderPage") {
        const { data, error } = await supabase
          .from('RESTAURANT')
          .select('*')
          // Using ilike makes it case-insensitive (maysfoodies vs MaysFoodies)
          .ilike('name', currentResName) 
          .single();

        if (data) {
          setRestaurant(data);
        } else if (error) {
          console.error("Restaurant not found:", error.message);
        }
      } else {
        // Fallback: If at root "/", just grab the first restaurant for welcome msg
        const { data } = await supabase.from('RESTAURANT').select('*').limit(1).single();
        setRestaurant(data);
      }
    }

    getRestaurant();
    
    // 3. This listener ensures that if you navigate to a different restaurant
    // without a full page refresh, the data updates.
  }, [window.location.pathname]);

  return (
    <BrowserRouter>
      {/* Wrapper to ensure our neutral background color from our design system is everywhere */}
      <div className="min-h-screen bg-neutral">
        <Navbar restaurant={restaurant} />
        
        <Routes>
          <Route
            path=":restaurantName/table/:tableNumber/menu"
            element={<MenuPage restaurant={restaurant} />}
          />
          <Route
            path=":restaurantName/table/:tableNumber/cart"
            element={<CartPage />}
          />
          <Route
            path=":restaurantName/table/:tableNumber/payment"
            element={<PaymentPage />}
          />
          <Route 
            path=":restaurantName/archived"
            element={<ArchivedPage />} 
          />
          <Route
            path=":restaurantName/OrderPage"
            element={<OrderPage />}
          />
          
          {/* Landing Page */}
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
              <h1 className="text-4xl font-headline font-extrabold text-secondary">
                Welcome to {restaurant?.name || 'Our Platform'}
              </h1>
              <p className="text-gray-500 mt-4 text-lg font-body">
                Please scan the QR code located on your table to access the menu.
              </p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;