import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { adminTournamentService } from '../../services/tournamentService';
import { gameService } from '../../services/gameService';
import { adminUserService } from '../../services/userService';
import TournamentFormModal from '../TournamentFormModal';
import ConfirmDialog from '../ConfirmDialog';
import { AdminTournament, TournamentRequest, Game, User, CancelTournamentResponse } from '../../shared/types/api.types';

const AdminTournamentsTab: React.FC = () => {
    const { showSuccess, showError } = useNotification();
    const { user } = useAuth(); // <-- obtenemos el usuario autenticado

    // State
    const [tournaments, setTournaments] = useState<AdminTournament[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showInactive, setShowInactive] = useState(false);

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState<AdminTournament | null>(null);
    const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [tournamentToDelete, setTournamentToDelete] = useState<AdminTournament | null>(null);
    const [isHardDelete, setIsHardDelete] = useState(false);

    // Cancel tournament states
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
    const [tournamentToCancel, setTournamentToCancel] = useState<AdminTournament | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelLoading, setIsCancelLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [currentPage, showInactive]);

    const loadData = async () => {
        try {
            setLoading(true);

            // --- GAMES ---
            const gamesResponse = await gameService.getAllGames();
            console.log('[AdminTournamentsTab] Respuesta getAllGames:', gamesResponse);
            if (gamesResponse.success && gamesResponse.data) {
                const gameItems = Array.isArray(gamesResponse.data) ? gamesResponse.data : [];
                console.log('[AdminTournamentsTab] Games extraídos:', gameItems);
                setGames(gameItems);
            } else {
                console.warn('[AdminTournamentsTab] Error al obtener juegos:', gamesResponse.message);
                setGames([]);
            }

            // --- USERS ---
            const usersResponse = await adminUserService.getAllUsers(0, 100);
            console.log('Respuesta getAllUsers (raw):', usersResponse);
            if (usersResponse.success && usersResponse.data) {
                const usersPayload: any = usersResponse.data;
                let userItems: User[] = [];
                if (Array.isArray(usersPayload)) {
                    userItems = usersPayload;
                } else if (Array.isArray(usersPayload.content)) {
                    userItems = usersPayload.content;
                } else {
                    console.warn('getAllUsers: formato inesperado:', usersPayload);
                }
                console.log('Users extraídos:', userItems);
                setUsers(userItems);
            } else {
                console.warn('getAllUsers no returned or success=false', usersResponse);
                setUsers([]);
            }

            // --- TOURNAMENTS ---
            const tournamentsResponse = await adminTournamentService.getAllTournaments(currentPage, 10);
            console.log('Respuesta getAllTournaments (raw):', tournamentsResponse);
            if (tournamentsResponse.success && tournamentsResponse.data) {
                const tournamentsPayload: any = tournamentsResponse.data;
                let tournamentItems: AdminTournament[] = [];

                if (Array.isArray(tournamentsPayload)) {
                    tournamentItems = tournamentsPayload;
                } else if (Array.isArray(tournamentsPayload.content)) {
                    tournamentItems = tournamentsPayload.content;
                } else {
                    console.warn('getAllTournaments: formato inesperado:', tournamentsPayload);
                }

                // Filtrar por activos si corresponde
                const filtered = showInactive ? tournamentItems : tournamentItems.filter(t => t.isActive);

                console.log('Torneos extraídos (filtrados):', filtered);

                setTournaments(filtered);

                // Actualizar totalPages si viene en el payload
                const maybeTotalPages = tournamentsPayload.totalPages ?? tournamentsPayload.total_pages ?? tournamentsPayload.total;
                if (typeof maybeTotalPages !== 'undefined') {
                    setTotalPages(Number(maybeTotalPages));
                }
            } else {
                console.warn('getAllTournaments no returned or success=false', tournamentsResponse);
                setTournaments([]);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: TournamentRequest) => {
        try {
            setSubmitting(true);

            // 🟦 ACTUALIZAR TORNEO
            if (editingTournament) {
                const response = await adminTournamentService.updateTournament(editingTournament.id, data);

                if (response.success && response.data) {
                    const updatedTournament: AdminTournament = response.data;

                    setTournaments(prev =>
                        prev.map(t => (t.id === editingTournament.id ? updatedTournament : t))
                    );

                    showSuccess('Torneo actualizado');
                } else {
                    showError(response.message || 'Error al actualizar');
                }

                // 🟩 CREAR TORNEO
            } else {
                // Convertir numericId del usuario autenticado
                console.log('[AdminTournamentsTab] Creando torneo - selectedOwner:', selectedOwner, 'user.numericId:', user?.numericId);

                let ownerId: number | null = null;

                // Si el admin seleccionó un owner específico, usar ese
                if (typeof selectedOwner === 'number' && !isNaN(selectedOwner)) {
                    ownerId = selectedOwner;
                }
                // Si no, usar el numericId del admin autenticado
                else if (user?.numericId) {
                    ownerId = user.numericId;
                }

                console.log('[AdminTournamentsTab] ownerId calculado:', ownerId);

                // Si no hay ownerId válido, mostrar error
                if (!ownerId) {
                    showError('Error: El admin autenticado no tiene un ID válido. Por favor, selecciona un propietario manualmente.');
                    console.error('ownerId no válido:', { selectedOwner, numericId: user?.numericId, ownerId });
                    return;
                }

                const response = await adminTournamentService.createTournament(data, ownerId);

                if (response.success && response.data) {
                    const newTournament: AdminTournament = response.data;
                    setTournaments(prev => [newTournament, ...prev]);
                    showSuccess('Torneo creado');
                } else {
                    showError(response.message || 'Error al crear');
                }
            }

            // Reset
            setIsFormOpen(false);
            setEditingTournament(null);
            setSelectedOwner(null);
        } catch (error) {
            console.error('Error:', error);
            showError('Error al guardar');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!tournamentToDelete) return;

        try {
            setIsDeleteLoading(true);
            let response;

            if (isHardDelete) {
                response = await adminTournamentService.hardDeleteTournament(tournamentToDelete.id);
            } else {
                response = await adminTournamentService.softDeleteTournament(tournamentToDelete.id);
            }

            if (response.success) {
                setTournaments(prev => prev.filter(t => t.id !== tournamentToDelete.id));
                showSuccess(isHardDelete ? 'Torneo eliminado permanentemente' : 'Torneo marcado como inactivo');
            } else {
                showError(response.message || 'Error al eliminar');
            }

            setDeleteConfirmOpen(false);
            setTournamentToDelete(null);
            setIsHardDelete(false);
        } catch (error) {
            console.error('Error:', error);
            showError('Error al eliminar');
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!tournamentToCancel) return;

        try {
            setIsCancelLoading(true);
            console.log(`[AdminTournamentsTab] Cancelando torneo ${tournamentToCancel.id}:`, { reason: cancelReason });

            const response = await adminTournamentService.cancelTournament(
                tournamentToCancel.id,
                { reason: cancelReason || undefined }
            ) as unknown as CancelTournamentResponse;

            if (response && 'refundedCount' in response) {
                // Actualizar el torneo en la lista
                setTournaments(prev =>
                    prev.map(t =>
                        t.id === tournamentToCancel.id
                            ? { ...t, status: 'CANCELLED' }
                            : t
                    )
                );

                showSuccess(
                    `Torneo cancelado: ${response.refundedCount} reembolso(s) procesado(s)`
                );

                // Mostrar errores si hay
                if (response.failedRefunds && response.failedRefunds.length > 0) {
                    const failedCount = response.failedRefunds.length;
                    showError(`⚠️ ${failedCount} reembolso(s) fallido(s) - Revisa los registros`);
                }
            } else {
                showError(response?.message || 'Error al cancelar torneo');
            }

            setCancelConfirmOpen(false);
            setTournamentToCancel(null);
            setCancelReason('');
        } catch (error) {
            console.error('Error:', error);
            showError('Error al cancelar torneo');
        } finally {
            setIsCancelLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        try {
            return new Date(dateString).toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getUserName = (userId: number) => users.find(u => u.id === userId)?.username || `Usuario ${userId}`;
    const getGameName = (gameId: number) => games.find(g => g.id === gameId)?.name || `Juego ${gameId}`;

    // Debug: estado antes del render
    console.log('Estado de games (antes render):', games);
    console.log('Estado de tournaments (antes render):', tournaments);
    console.log('Usuario autenticado:', user);

    if (loading) {
        return <div className="text-center py-12">Cargando...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Torneos ({tournaments.length})</h3>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => {
                                setShowInactive(e.target.checked);
                                setCurrentPage(0);
                            }}
                            className="w-4 h-4"
                        />
                        Mostrar inactivos
                    </label>
                    <button
                        onClick={() => {
                            // Al crear un torneo, resetear datos y opcionalmente asignar propietario al admin
                            console.log('[AdminTournamentsTab] Abriendo modal crear - user.numericId:', user?.numericId);
                            setEditingTournament(null);
                            // Por defecto, el owner es el admin autenticado (usando su numericId)
                            if (user?.numericId) {
                                console.log('[AdminTournamentsTab] Asignando owner por defecto:', user.numericId);
                                setSelectedOwner(user.numericId);
                            } else {
                                console.warn('[AdminTournamentsTab] No hay user.numericId disponible');
                                setSelectedOwner(null);
                            }
                            setIsFormOpen(true);
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg text-sm font-medium"
                    >
                        + Crear Torneo
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-700">
                        <tr className="text-gray-400">
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Propietario</th>
                            <th className="px-4 py-3">Juego</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Jugadores</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Inicio</th>
                            <th className="px-4 py-3">Fin</th>
                            <th className="px-4 py-3">Activo</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tournaments.map((tournament) => (
                            <tr key={tournament.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                <td className="px-4 py-3">{tournament.name}</td>
                                <td className="px-4 py-3">{getUserName(tournament.userId)}</td>
                                <td className="px-4 py-3">{getGameName(tournament.gameId)}</td>
                                <td className="px-4 py-3 capitalize">{tournament.status}</td>
                                <td className="px-4 py-3">{tournament.minPlayers}-{tournament.maxPlayers}</td>
                                <td className="px-4 py-3">{tournament.isOnline ? '🌐' : '📍'}</td>
                                <td className="px-4 py-3">{formatDate(tournament.startAt)}</td>   {/* NUEVO */}
                                <td className="px-4 py-3">{formatDate(tournament.endAt)}</td>     {/* NUEVO */}
                                <td className="px-4 py-3">
                                    <span className={tournament.isActive ? 'text-green-400' : 'text-red-400'}>
                                        {tournament.isActive ? '✓' : '✗'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingTournament(tournament);
                                                setIsFormOpen(true);
                                            }}
                                            className="text-cyan-400 hover:text-cyan-300"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        {tournament.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => {
                                                    setTournamentToCancel(tournament);
                                                    setCancelReason('');
                                                    setCancelConfirmOpen(true);
                                                }}
                                                className="text-orange-400 hover:text-orange-300"
                                                title="Cancelar Torneo"
                                            >
                                                ❌
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setTournamentToDelete(tournament);
                                                setIsHardDelete(false);
                                                setDeleteConfirmOpen(true);
                                            }}
                                            className="text-red-400 hover:text-red-300"
                                            title="Soft Delete"
                                        >
                                            🗑️
                                        </button>
                                        {!tournament.isActive && (
                                            <button
                                                onClick={() => {
                                                    setTournamentToDelete(tournament);
                                                    setIsHardDelete(true);
                                                    setDeleteConfirmOpen(true);
                                                }}
                                                className="text-gray-400 hover:text-gray-300"
                                                title="Hard Delete"
                                            >
                                                ⚠️
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                    Página {currentPage + 1} de {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition"
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition"
                    >
                        Siguiente →
                    </button>
                </div>
            </div>

            {/* Modales */}
            <TournamentFormModal
                isOpen={isFormOpen}
                title={editingTournament ? 'Editar Torneo' : 'Crear Torneo'}
                initialData={editingTournament ?? undefined}
                games={games}
                onSubmit={handleSubmit}
                onCancel={() => {
                    setIsFormOpen(false);
                    setEditingTournament(null);
                    setSelectedOwner(null);
                }}
                isLoading={submitting}
            />

            {/* Selector de propietario solo aparece si no hay selectedOwner */}
            {!editingTournament && isFormOpen && selectedOwner == null && (
                <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">Selecciona el Propietario</h3>
                        <select
                            value={selectedOwner || ''}
                            onChange={(e) => setSelectedOwner(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white mb-4"
                        >
                            <option value="">-- Selecciona un usuario --</option>
                            {users.map((userItem) => (
                                <option key={userItem.id} value={userItem.id}>
                                    {userItem.username} ({userItem.email})
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setSelectedOwner(null);
                                }}
                                className="flex-1 px-4 py-2 rounded border border-gray-600 hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedOwner) {
                                        // Continuar al formulario (el modal principal ya está abierto)
                                    }
                                }}
                                disabled={!selectedOwner}
                                className="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title={isHardDelete ? "Eliminar Permanentemente" : "Marcar como Inactivo"}
                message={`¿Estás seguro de que deseas ${isHardDelete ? 'eliminar permanentemente' : 'marcar como inactivo'} el torneo "${tournamentToDelete?.name}"?`}
                confirmText={isHardDelete ? "Eliminar" : "Marcar Inactivo"}
                isDangerous={true}
                isLoading={isDeleteLoading}
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleteConfirmOpen(false);
                    setTournamentToDelete(null);
                    setIsHardDelete(false);
                }}
            />

            {/* Cancel Tournament Modal */}
            {cancelConfirmOpen && tournamentToCancel && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4 text-orange-400">
                            ⚠️ Cancelar Torneo
                        </h3>

                        <div className="mb-4 p-3 bg-gray-700/50 rounded border border-orange-500/30">
                            <p className="text-sm text-gray-300">
                                <span className="font-semibold">Torneo:</span> {tournamentToCancel.name}
                            </p>
                            <p className="text-sm text-gray-300 mt-1">
                                <span className="font-semibold">Propietario:</span> {getUserName(tournamentToCancel.userId)}
                            </p>
                            <p className="text-sm text-orange-400 mt-2">
                                Se procesarán reembolsos automáticos para todas las reservas pagadas.
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Razón (opcional)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Explica por qué se cancela este torneo..."
                                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white text-sm focus:outline-none focus:border-orange-500"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setCancelConfirmOpen(false);
                                    setTournamentToCancel(null);
                                    setCancelReason('');
                                }}
                                disabled={isCancelLoading}
                                className="flex-1 px-4 py-2 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isCancelLoading}
                                className="flex-1 px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 disabled:opacity-50 transition font-medium"
                            >
                                {isCancelLoading ? 'Procesando...' : 'Confirmar Cancelación'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTournamentsTab;