import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home.js';
import Gallery from '../pages/Gallery.js';
import Contact from '../pages/Contact.js';
import Cart from '../pages/Cart.js';
import Account from '../pages/Account.js';
import { AuthForm } from '../pages/AuthForm.js';
import PrivateRoute from '../components/PrivateRoute.js';
import PathConstants from './pathConstants.js';
import MainContent from "../components/MainContent.js";
import NotFound from "../pages/NotFound.js";

import ItinerariesList from "../pages/ItinerariesList.js";
import ItineraryDetail from "../pages/ItineraryDetail.js";
import ItinerariesAdmin from "../pages/ItinerariesAdmin.js";

const routes = [
    { path: PathConstants.INDEX, element: <Home /> },
    { path: PathConstants.GALLERY, element: <Gallery /> },
    { path: PathConstants.CONTACT, element: <Contact /> },
    {
      path: PathConstants.ITINERARY_LIST,
      element: (
        <PrivateRoute>
          <ItinerariesList />
        </PrivateRoute>
      ),
    },
    {
      path: PathConstants.ITINERARY_DETAILS,
      element: (
        <PrivateRoute>
          <ItineraryDetail />
        </PrivateRoute>
      ),
    },
    { path: PathConstants.LOGIN, element: <AuthForm /> },
    {
      path: PathConstants.ACCOUNT,
      element: (
        <PrivateRoute>
          <Account />
        </PrivateRoute>
      ),
    },
    {
      path: PathConstants.ITINERARY_ADMIN,
      element: (
        <PrivateRoute>
          <ItinerariesAdmin />
        </PrivateRoute>
      ),
    },
    {
      path: PathConstants.CART,
      element: (
        <PrivateRoute>
          <Cart/>
        </PrivateRoute>
      ),
    },
];

const router = createBrowserRouter(
  [
    {
      element: <MainContent/>,
      children: routes.map((route) => ({
        ...route,
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <div className="loader"></div>
                <p className="text-gray-500">Loading...</p>
              </div>
            }
          >
            {route.element}
          </Suspense>
        ),
      })),
    },
    { element: <NotFound />, path: "*" },
  ],
  { basename: PathConstants.BASENAME }
);

export default router;
