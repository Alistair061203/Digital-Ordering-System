// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './connectDB';

// 1. IMPORT YOUR NEW PROVIDER AND LANDING PAGE
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';

import MenuPage from './pages/MenuPage';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderPage from './pages/OrderPage';
import ArchivedPage from './pages/ArchivedPage';
import AdminLandingPage from './pages/AdminLandingPage';
import AdminLogin from './pages/AdminLogin';
import './App.css';

function App() {
  const [restaurant, setRestaurant] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

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

    // Check admin authentication
    const checkAdminAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
      const adminRestaurant = localStorage.getItem('adminRestaurant');
      const pathParts = window.location.pathname.split('/');
      const currentResName = pathParts[1];

      // Only set authenticated if it's for the current restaurant
      setIsAdminAuthenticated(authenticated && adminRestaurant === currentResName);
    };

    getRestaurant();
    checkAdminAuth();
    
    // 3. This listener ensures that if you navigate to a different restaurant
    // without a full page refresh, the data updates.
  }, [window.location.pathname]);

  return (
    // 2. WRAP YOUR ENTIRE ROUTER IN THE CART PROVIDER
    <CartProvider>
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
              path=":restaurantName/admin/login"
              element={<AdminLogin />}
            />
            <Route
              path=":restaurantName/admin"
              element={isAdminAuthenticated ? <AdminLandingPage /> : <AdminLogin />}
            />
            <Route 
              path=":restaurantName/admin/archived"
              element={isAdminAuthenticated ? <ArchivedPage /> : <AdminLogin />} 
            />
            <Route
              path=":restaurantName/admin/OrderPage"
              element={isAdminAuthenticated ? <OrderPage /> : <AdminLogin />}
            />
             <Route
              path=":restaurantName/admin/Menu"
              element={isAdminAuthenticated ? <MenuPage /> : <AdminLogin />}
            />
            
            {/* 3. REPLACED THE INLINE DIV WITH YOUR NEW LANDING PAGE */}
            <Route path="/" element={<LandingPage />} />
            
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;