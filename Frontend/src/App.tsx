import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { RoleGuard } from './components/RoleGuard';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import ShopPage from './pages/ShopPage';
import TournamentDetails from './pages/TournamentDetails';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <Layout>
                        <NotificationToast />
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/unauthorized" element={<UnauthorizedPage />} />

                            {/* Protected routes - User */}
                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <ProfilePage />
                                    </PrivateRoute>
                                }
                            />

                            {/* Protected routes - Other user pages */}
                            <Route
                                path="/shop"
                                element={
                                    <PrivateRoute>
                                        <ShopPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/tournaments/:id"
                                element={
                                    <PrivateRoute>
                                        <TournamentDetails />
                                    </PrivateRoute>
                                }
                            />

                            {/* Protected routes - Admin */}
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <RoleGuard>
                                            <AdminDashboard />
                                        </RoleGuard>
                                    </PrivateRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Layout>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;