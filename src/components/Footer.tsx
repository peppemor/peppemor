import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Camera className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Napoli in Frame</span>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Premium quality photo prints delivered to your doorstep. Preserve your memories with our professional printing services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/prints" className="text-sm text-gray-600 hover:text-gray-900">
                  Photo Prints
                </Link>
              </li>
              <li>
                <Link to="/canvas" className="text-sm text-gray-600 hover:text-gray-900">
                  Canvas Prints
                </Link>
              </li>
              <li>
                <Link to="/frames" className="text-sm text-gray-600 hover:text-gray-900">
                  Frames
                </Link>
              </li>
              <li>
                <Link to="/albums" className="text-sm text-gray-600 hover:text-gray-900">
                  Photo Albums
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 hover:text-gray-900">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-gray-600 hover:text-gray-900">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-gray-600 hover:text-gray-900">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} PhotoPrints. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;