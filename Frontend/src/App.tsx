import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TournamentListPage from './pages/TournamentListPage';
// import TournamentDetailPage from './pages/TournamentDetailPage';
// import TournamentFormPage from './pages/TournamentFormPage';
import Layout from './components/layout/Layout';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/tournaments" element={<TournamentListPage />} />
                    {/* <Route path="/tournaments/create" element={<TournamentFormPage />} /> */}
                    {/* <Route path="/tournaments/:slug" element={<TournamentDetailPage />} /> */}
                    {/* <Route path="/tournaments/:id/edit" element={<TournamentFormPage />} /> */}
                    {/* <Route path="/about" element={<div className="min-h-screen flex items-center justify-center">About Page (Coming Soon)</div>} />
                    <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center">Contact Page (Coming Soon)</div>} />
                    <Route path="*" element={<div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div>} /> */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;