import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartItem } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const NavigationContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, signOut } = useAuth();

  const addToCart = (item: CartItem) => {
    setCartItems([...cartItems, item]);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-gray-800">
                Napoli in Frame
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/gallery" className="text-gray-600 hover:text-gray-900"onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900"onClick={() => setIsMenuOpen(false)}>Contact</Link>
                {user ? (
                <div className="relative">
                  <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                  >
                  <User className="w-6 h-6 mr-2" />
                  {user.username}
                  </button>
                  {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                  to="/account"
                  className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                  >
                  <User className="w-4 h-4 mr-2" />
                  <span>Account</span>
                  </Link>
                  <button
                  onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                  </button>
                  </div>
                  )}
                </div>
                ) : (
                <Link to="/login" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Login</Link>
                )}
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/gallery" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Gallery</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Contact</Link>
              {user ? (
                <>
                  <Link to="/cart" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                    Cart ({cartItems.length})
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Login</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery addToCart={addToCart} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart cartItems={cartItems} setCartItems={setCartItems} />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NavigationContent />
      </AuthProvider>
    </Router>
  );
};

export default App;