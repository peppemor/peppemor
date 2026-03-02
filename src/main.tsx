import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

import './index.css';
import 'leaflet/dist/leaflet.css';

import { AuthProvider } from './contexts/AuthContext.js';
import { CartProvider } from './contexts/CartContext.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>   
  </StrictMode>
);
