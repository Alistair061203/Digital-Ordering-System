import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap your App here */}
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)

