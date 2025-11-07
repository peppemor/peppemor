import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from './App.tsx';

import './index.css';
import 'leaflet/dist/leaflet.css';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext.tsx';
import { supabase } from './supabase/supabaseClients';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </SessionContextProvider>   
  </StrictMode>
);
