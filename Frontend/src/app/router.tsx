import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { MainLayout } from '../components/Layout';

const router = createBrowserRouter([
    {
        element: <MainLayout />, // 👈 layout global
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/home',
                element: <HomePage />,
            },
            {
                path: '/shop',
                element: <ShopPage />,
            },
        ],
    },
]);

export const AppRouter = () => <RouterProvider router={router} />;
