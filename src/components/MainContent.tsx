import React from 'react';
import { Outlet } from 'react-router-dom';

import NavigationBar from './NavigationBar.js';
import Footer from './Footer.js';


const MainContent: React.FC = () => {
  
    return (
      <div className="min-h-screen bg-white">
        <NavigationBar />
  
        <div className="pt-16">
          <Outlet />
        </div>

        <Footer />
      </div>
    );
  };

  export default MainContent;