import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { adminTournamentService } from '../services/tournamentService';
import { adminGameService } from '../services/gameService';
import { adminUserService } from '../services/userService';
import AdminTournamentsTab from '../components/admin/AdminTournamentsTab';
import AdminGamesTab from '../components/admin/AdminGamesTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';

type TabType = 'tournaments' | 'games' | 'users';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('tournaments');

    const tabs: Array<{ id: TabType; label: string; icon: string }> = [
        { id: 'tournaments', label: 'Torneos', icon: '🏆' },
        { id: 'games', label: 'Juegos', icon: '🎮' },
        { id: 'users', label: 'Usuarios', icon: '👥' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-950 text-white p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
                    <p className="text-gray-400">Gestiona torneos, juegos y usuarios del sistema</p>
                </div>

                {/* Tabs navegación */}
                <div className="flex gap-4 mb-8 border-b border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 font-semibold border-b-2 transition ${activeTab === tab.id
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Contenido de tabs */}
                <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
                    {activeTab === 'tournaments' && <AdminTournamentsTab />}
                    {activeTab === 'games' && <AdminGamesTab />}
                    {activeTab === 'users' && <AdminUsersTab />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
