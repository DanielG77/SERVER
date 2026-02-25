import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import TournamentDetails from '../pages/TournamentDetails';
import ProfilePage from '../pages/ProfilePage';

import { MainLayout } from '../components/Layout';
import Login from '../pages/Login';
import { PrivateRoute } from '../components/PrivateRoute';

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/home', element: <HomePage /> },
            { path: '/shop', element: <ShopPage /> },
            { path: '/shop/:id', element: <TournamentDetails /> },
            { path: '/login', element: <Login /> },
            {
                path: '/perfil',
                element: (
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                )
            },
        ],
    },
]);

export const AppRouter = () => <RouterProvider router={router} />;
