import React from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from "react-router-dom";
import router from './routes/indexRoutes.js';

const App: React.FC = () => {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router} />
    </>
  );
};

export default App;