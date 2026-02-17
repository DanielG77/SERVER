import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../features/tournaments/components/HomePage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/home',
        element: <HomePage />,
    },
]);

export const AppRouter = () => <RouterProvider router={router} />;