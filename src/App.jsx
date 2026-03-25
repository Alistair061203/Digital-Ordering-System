import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './connectDB';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import DisplayRestaurant from './components/DisplayRestaurant';
import './App.css'
function App() {
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function getRestaurant() {
      // Get your restaurant details from Supabase
      const { data } = await supabase.from('RESTAURANT').select('*').limit(1).single();
      setRestaurant(data);
    }
    getRestaurant();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=":restaurantName/table/:tableNumber/menu"
          element={<MenuPage restaurant={restaurant} cart={cart} setCart={setCart} />}
        />
        <Route
          path=":restaurantName/table/:tableNumber/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600">Welcome to {restaurant?.name || 'Our Restaurant'}</h1>
            <p className="text-gray-500 mt-2 text-lg">Scan the QR code on your table to see the menu.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;