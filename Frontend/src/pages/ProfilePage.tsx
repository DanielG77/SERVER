import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { userTournamentService } from '../services/tournamentService';
import { gameService } from '../services/gameService';
import { reservationService } from '../services/reservationService'; // <-- añade esto
import TournamentFormModal from '../components/TournamentFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { UserTournament, TournamentRequest, Game, TicketReservation } from '../shared/types/api.types';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { showSuccess, showError } = useNotification();

    const [tournaments, setTournaments] = useState<UserTournament[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState<UserTournament | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [tournamentToDelete, setTournamentToDelete] = useState<UserTournament | null>(null);

    const [reservations, setReservations] = useState<TicketReservation[]>([]);

    const [reservationSearch, setReservationSearch] = useState('');
    const [reservationStatusFilter, setReservationStatusFilter] = useState<'ALL' | TicketReservation['status']>('ALL');
    const [reservationPage, setReservationPage] = useState(1);

    const RESERVATIONS_PER_PAGE = 6;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                console.log('[ProfilePage] Cargando juegos del endpoint público...');
                const gamesResponse = await gameService.getAllGames();
                console.log('[ProfilePage] Respuesta getAllGames:', gamesResponse);

                if (gamesResponse.success && gamesResponse.data) {
                    const gameItems = Array.isArray(gamesResponse.data) ? gamesResponse.data : [];
                    setGames(gameItems);
                    console.log('[ProfilePage] Juegos cargados exitosamente:', gameItems.length, 'juegos');
                } else {
                    console.warn('[ProfilePage] Error al cargar juegos:', gamesResponse.message);
                    showError('Error al cargar juegos: ' + (gamesResponse.message || 'Desconocido'));
                }

                console.log('[ProfilePage] Cargando torneos del usuario...');
                const tournamentsResponse = await userTournamentService.getMyTournaments(0, 50);
                if (tournamentsResponse.success && tournamentsResponse.data) {
                    setTournaments(tournamentsResponse.data.content || []);
                    console.log('[ProfilePage] Torneos cargados:', tournamentsResponse.data.content?.length || 0, 'torneos');
                } else {
                    console.warn('[ProfilePage] Error al cargar torneos:', tournamentsResponse.message);
                    showError('Error al cargar torneos: ' + (tournamentsResponse.message || 'Desconocido'));
                }

                console.log('[ProfilePage] Llamando a GET /reservations...');
                const reservationsResponse = await reservationService.getMyReservations();
                console.log('[ProfilePage] Respuesta GET /reservations:', reservationsResponse);

                if (reservationsResponse.success && reservationsResponse.data) {
                    const reservationsList = Array.isArray(reservationsResponse.data)
                        ? reservationsResponse.data
                        : [];

                    setReservations(reservationsList);
                    console.log('[ProfilePage] Reservas del usuario:', reservationsList);
                } else {
                    console.warn('[ProfilePage] Error al cargar reservas:', reservationsResponse.message);
                    showError('Error al cargar reservas: ' + (reservationsResponse.message || 'Desconocido'));
                }
            } catch (error) {
                console.error('[ProfilePage] Error en loadData:', error);
                showError('Error al cargar datos. Intenta recargar la página.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [showError]);

    const handleOpenCreateModal = () => {
        // if (games.length === 0) {
        //     showError('Los juegos aún no están disponibles. Intenta de nuevo.');
        //     return;
        // }
        setEditingTournament(null);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (tournament: UserTournament) => {
        // if (games.length === 0) {
        // showError('Los juegos aún no están disponibles. Intenta de nuevo.');
        // return;
        // }
        setEditingTournament(tournament);
        setIsFormOpen(true);
    };

    const handleSubmitTournament = async (data: TournamentRequest) => {
        try {
            setSubmitting(true);

            if (editingTournament) {
                // Update
                console.log('[ProfilePage] Actualizando torneo:', editingTournament.id);
                const response = await userTournamentService.updateMyTournament(editingTournament.id, data);

                if (response.success && response.data) {
                    const updatedTournament: UserTournament = response.data;
                    console.log('[ProfilePage] Torneo actualizado:', updatedTournament);

                    const updatedTournaments = tournaments.map(t =>
                        t.id === editingTournament.id ? updatedTournament : t
                    );

                    setTournaments(updatedTournaments);
                    showSuccess('Torneo actualizado exitosamente');
                } else {
                    console.error('[ProfilePage] Error al actualizar:', response.message);
                    showError(response.message || 'Error al actualizar torneo');
                }
            } else {
                // Create
                console.log('[ProfilePage] Creando nuevo torneo');
                const response = await userTournamentService.createTournament(data);

                if (response.success && response.data) {
                    const newTournament: UserTournament = response.data;
                    console.log('[ProfilePage] Torneo creado:', newTournament);

                    setTournaments(prev => [...prev, newTournament]);

                    showSuccess('Torneo creado exitosamente');
                } else {
                    console.error('[ProfilePage] Error al crear:', response.message);
                    showError(response.message || 'Error al crear torneo');
                }
            }

            setIsFormOpen(false);
            setEditingTournament(null);
        } catch (error) {
            console.error('[ProfilePage] Error submitting tournament:', error);
            showError('Error al guardar torneo');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (tournament: UserTournament) => {
        setTournamentToDelete(tournament);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!tournamentToDelete) return;

        try {
            setIsDeleteLoading(true);
            const response = await userTournamentService.deleteMyTournament(tournamentToDelete.id);

            if (response.success) {
                setTournaments(tournaments.filter(t => t.id !== tournamentToDelete.id));
                showSuccess('Torneo eliminado exitosamente');
            } else {
                showError(response.message || 'Error al eliminar torneo');
            }

            setDeleteConfirmOpen(false);
            setTournamentToDelete(null);
        } catch (error) {
            console.error('Error deleting tournament:', error);
            showError('Error al eliminar torneo');
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTournament(null);
    };

    const getGameName = (gameId: number) => {
        return games.find(g => g.id === gameId)?.name || `Juego ${gameId}`;
    };

    const filteredReservations = useMemo(() => {
        return reservations.filter((reservation) => {
            const matchesSearch =
                reservation.tournamentName
                    ?.toLowerCase()
                    .includes(reservationSearch.toLowerCase().trim()) || false;

            const matchesStatus =
                reservationStatusFilter === 'ALL' || reservation.status === reservationStatusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [reservations, reservationSearch, reservationStatusFilter]);

    const totalReservationPages = Math.max(
        1,
        Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE)
    );

    const paginatedReservations = filteredReservations.slice(
        (reservationPage - 1) * RESERVATIONS_PER_PAGE,
        reservationPage * RESERVATIONS_PER_PAGE
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-300">Cargando perfil...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                {/* Perfil superior */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-xl p-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-5xl font-bold shadow-lg">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-2">{user?.username}</h1>
                            <p className="text-blue-200 mb-2">{user?.email}</p>
                            <div className="flex gap-2">
                                {user?.roles?.map((role) => (
                                    <span
                                        key={role}
                                        className="px-3 py-1 bg-blue-700 rounded-full text-sm font-medium"
                                    >
                                        {role.replace('ROLE_', '')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de reservas */}
                <div className="bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Mis Reservas</h2>
                            <p className="text-sm text-gray-400">
                                {filteredReservations.length} reserva(s) encontradas
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Buscar por torneo..."
                                value={reservationSearch}
                                onChange={(e) => {
                                    setReservationSearch(e.target.value);
                                    setReservationPage(1);
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                value={reservationStatusFilter}
                                onChange={(e) => {
                                    setReservationStatusFilter(e.target.value as 'ALL' | TicketReservation['status']);
                                    setReservationPage(1);
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">Todos</option>
                                <option value="PENDING">Pendientes</option>
                                <option value="PAID">Pagadas</option>
                                <option value="CANCELLED">Canceladas</option>
                                <option value="EXPIRED">Expiradas</option>
                            </select>
                        </div>
                    </div>

                    {filteredReservations.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No hay reservas que coincidan con el filtro.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4">
                                {paginatedReservations.map((reservation) => {
                                    const isPending = reservation.status === 'PENDING';
                                    const isPaid = reservation.status === 'PAID';
                                    const isCanceled = reservation.status === 'CANCELLED';
                                    const isExpired = reservation.status === 'EXPIRED';

                                    let statusClass = 'bg-gray-600 text-white';
                                    if (isPending) statusClass = 'bg-yellow-600 text-white';
                                    if (isPaid) statusClass = 'bg-green-600 text-white';
                                    if (isCanceled) statusClass = 'bg-red-600 text-white';
                                    if (isExpired) statusClass = 'bg-gray-500 text-white';

                                    return (
                                        <div
                                            key={reservation.id}
                                            className="bg-gray-700 rounded-lg p-5 hover:bg-gray-600 transition"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold mb-2">
                                                        {reservation.tournamentName || 'Torneo sin nombre'}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                                                        <p>
                                                            <span className="text-gray-400">ID reserva:</span>{' '}
                                                            <span className="font-mono">{reservation.id}</span>
                                                        </p>

                                                        <p>
                                                            <span className="text-gray-400">Importe:</span>{' '}
                                                            <span className="font-semibold">
                                                                {reservation.amount} {reservation.currency?.toUpperCase()}
                                                            </span>
                                                        </p>

                                                        <p>
                                                            <span className="text-gray-400">Fecha reserva:</span>{' '}
                                                            <span className="font-semibold">
                                                                {reservation.createdAt
                                                                    ? new Date(reservation.createdAt).toLocaleString('es-ES')
                                                                    : 'No disponible'}
                                                            </span>
                                                        </p>

                                                        <p>
                                                            <span className="text-gray-400">Expira:</span>{' '}
                                                            <span className="font-semibold">
                                                                {reservation.expiresAt
                                                                    ? new Date(reservation.expiresAt).toLocaleString('es-ES')
                                                                    : 'No disponible'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start md:items-end gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                                                        {reservation.status}
                                                    </span>

                                                    <p className="text-xs text-gray-400">
                                                        Torneo ID: {reservation.tournamentId}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <button
                                    disabled={reservationPage === 1}
                                    onClick={() => setReservationPage((p) => Math.max(1, p - 1))}
                                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>

                                <span className="text-sm text-gray-400">
                                    Página {reservationPage} de {totalReservationPages}
                                </span>

                                <button
                                    disabled={reservationPage >= totalReservationPages}
                                    onClick={() => setReservationPage((p) => Math.min(totalReservationPages, p + 1))}
                                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Sección de crear torneo */}
                <div className="bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Mis Torneos</h2>
                        <button
                            onClick={handleOpenCreateModal}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg font-semibold"
                        >
                            + Crear Torneo
                        </button>
                    </div>

                    {/* Lista de torneos */}
                    {tournaments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">No tienes torneos creados aún.</p>
                            <button
                                onClick={handleOpenCreateModal}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
                            >
                                Crear Tu Primer Torneo
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {tournaments.map((tournament) => (
                                <div
                                    key={tournament.id}
                                    className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                                            <p className="text-gray-300 text-sm mb-3">{tournament.description}</p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Juego</span>
                                                    <p className="font-semibold">{getGameName(tournament.gameId)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Estado</span>
                                                    <p className="font-semibold capitalize">{tournament.status}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Jugadores</span>
                                                    <p className="font-semibold">
                                                        {tournament.minPlayers}-{tournament.maxPlayers}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Tipo</span>
                                                    <p className="font-semibold">
                                                        {tournament.isOnline ? '🌐 Online' : '📍 Presencial'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-600">
                                        <button
                                            onClick={() => handleOpenEditModal(tournament)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-sm font-medium"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(tournament)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg text-sm font-medium"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modales */}
            <TournamentFormModal
                isOpen={isFormOpen}
                title={editingTournament ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
                initialData={editingTournament ?? undefined}
                games={games}
                onSubmit={handleSubmitTournament}
                onCancel={handleCloseForm}
                isLoading={submitting}
            />

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title="Eliminar Torneo"
                message={`¿Estás seguro de que deseas eliminar el torneo "${tournamentToDelete?.name}"? Esta acción no puede deshacerse.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                isDangerous={true}
                isLoading={isDeleteLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteConfirmOpen(false);
                    setTournamentToDelete(null);
                }}
            />
        </div>
    );
};

export default ProfilePage;