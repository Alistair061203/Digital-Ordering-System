// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './connectDB';
import MenuPage from './pages/MenuPage';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import './App.css';
import OrderPage from './pages/OrderPage';
import QRScannerPage from './pages/QRScannerPage';

function App() {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    async function getRestaurant() {
      const { data } = await supabase.from('RESTAURANT').select('*').limit(1).single();
      setRestaurant(data);
    }
    getRestaurant();
  }, []);

  return (
    <BrowserRouter>
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
          path=":restaurantName/OrderPage"
          element={<OrderPage />}
        />
        <Route path="/scan" element={<QRScannerPage />} />
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600">Welcome to {restaurant?.name || 'Our Restaurant'}</h1>
            <p className="text-gray-500 mt-2 text-lg">Scan the QR code on your table to see the menu.</p>
            <Link to="/scan" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Scan QR Code
            </Link>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;