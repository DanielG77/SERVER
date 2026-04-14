import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import TournamentDetails from '../pages/TournamentDetails';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboard from '../pages/AdminDashboard';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentStatusPage } from '../pages/PaymentStatusPage';
import { SearchPage } from '../pages/SearchPage';

import { MainLayout } from '../components/Layout';
import Login from '../pages/Login';
import { PrivateRoute } from '../components/PrivateRoute';
import { RoleGuard } from '../components/RoleGuard';

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/home', element: <HomePage /> },
            { path: '/shop', element: <ShopPage /> },
            { path: '/shop/:id', element: <TournamentDetails /> },
            { path: '/search', element: <SearchPage /> },
            { path: '/login', element: <Login /> },
            { path: '/unauthorized', element: <UnauthorizedPage /> },
            {
                path: '/profile',
                element: (
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                )
            },
            {
                path: '/perfil',
                element: <Navigate to="/profile" replace />
            },
            {
                path: '/admin',
                element: (
                    <PrivateRoute>
                        <RoleGuard requiredRoles={['ADMIN', 'ROLE_ADMIN']}>
                            <AdminDashboard />
                        </RoleGuard>
                    </PrivateRoute>
                )
            },
            {
                path: '/reservations/:reservationId/pay',
                element: (
                    <PrivateRoute>
                        <PaymentPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/reservations/:reservationId/status',
                element: (
                    <PrivateRoute>
                        <PaymentStatusPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '*',
                element: <Navigate to="/" replace />
            }
        ],
    },
]);

export const AppRouter = () => <RouterProvider router={router} />;
