import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User, ShoppingCart, Camera, Settings} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PathConstants from '../routes/pathConstants';
import { useCart } from '../contexts/CartContext';
import Avatar from './ui/Avatar';

const NavigationBar: React.FC = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={PathConstants.INDEX} className="flex items-center text-xl font-semibold text-gray-800">
              <Camera className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Napoli in Frame</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to={PathConstants.INDEX}
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={PathConstants.GALLERY}
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to={PathConstants.ITINERARY_LIST}
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Itinerari
            </Link>
            <Link
              to={PathConstants.CONTACT}
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user && (
              <Link
                to={PathConstants.CART}
                className="relative text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <Avatar
                    src={profile?.avatar_url || ''} // Ensure profile is not null before accessing avatarUrl
                    alt={profile?.username} // Non-null assertion
                    size="sm"
                  />
                  <span className="ml-2">{profile?.username}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link
                      to={PathConstants.ACCOUNT}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span>Account</span>
                    </Link>
                    <Link
                      to={PathConstants.ITINERARY_ADMIN}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Admin</span>
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
              <Link
                to={PathConstants.LOGIN}
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
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
            <Link
              to={PathConstants.INDEX}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              to={PathConstants.GALLERY}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              Gallery
            </Link>
            <Link
              to={PathConstants.CONTACT}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to={PathConstants.CART}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cart ({cartItems.length})
                </Link>
                <Link
                  to={PathConstants.ACCOUNT}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to={PathConstants.LOGIN}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;