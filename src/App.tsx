import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavigationContent from './components/NavigationContent';


const App: React.FC = () => {
  return (
    <BrowserRouter>
        <NavigationContent />
    </BrowserRouter>
  );
};

export default App;