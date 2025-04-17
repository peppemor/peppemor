import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Cart from '../pages/Cart';
import Account from '../pages/Account';
import { AuthForm } from '../pages/AuthForm';
import PrivateRoute from '../components/PrivateRoute';
import PathConstants from './pathConstants';
import NavigationContent from "../components/NavigationContent";
import NotFound from "../pages/NotFound";

const routes = [
    { path: PathConstants.INDEX, element: <Home /> },
    { path: PathConstants.GALLERY, element: <Gallery /> },
    { path: PathConstants.CONTACT, element: <Contact /> },
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
      element: <NavigationContent/>,
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
