import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { adminGameService } from '../../services/gameService';
import ConfirmDialog from '../ConfirmDialog';
import { Game, GameRequest } from '../../shared/types/api.types';

const AdminGamesTab: React.FC = () => {
    const { showSuccess, showError } = useNotification();

    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [formData, setFormData] = useState<GameRequest>({
        name: '',
        description: '',
        iconUrl: '',
        releaseDate: '',
    });

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            setLoading(true);
            const response = await adminGameService.getAllGames();

            console.log('Respuesta de getAllGames:', response);

            if (response.success && response.data) {
                // response.data puede ser:
                // 1) un array de juegos -> Game[]
                // 2) un objeto paginado -> { content: Game[], totalPages, ... }
                const payload: any = response.data;

                let items: Game[] = [];

                if (Array.isArray(payload)) {
                    items = payload;
                } else if (Array.isArray(payload.content)) {
                    items = payload.content;
                } else {
                    console.warn('getAllGames: response.data no tiene la forma esperada', payload);
                }

                console.log('Datos de juegos recibidos (items):', items);

                setGames(items);

                // Si quieres manejar paginación en el componente, actualiza totalPages aquí:
                // if (typeof payload.totalPages !== 'undefined') {
                //   setTotalPages(payload.totalPages);
                // }
            } else {
                console.warn('No se recibieron juegos o success=false:', response);
                setGames([]); // dejo explícito
            }
        } catch (error) {
            console.error('Error loading games:', error);
            showError('Error al cargar juegos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            showError('El nombre del juego es requerido');
            return;
        }

        try {
            setSubmitting(true);

            // 🟦 EDITAR JUEGO
            if (editingGame) {
                const response = await adminGameService.updateGame(editingGame.id, formData);

                if (response.success && response.data) {
                    const updatedGame: Game = response.data;

                    setGames(
                        games.map(g =>
                            g.id === editingGame.id ? updatedGame : g
                        )
                    );

                    showSuccess('Juego actualizado');
                } else {
                    showError(response.message || 'Error al actualizar el juego');
                }

                // 🟩 CREAR JUEGO
            } else {
                const response = await adminGameService.createGame(formData);

                if (response.success && response.data) {
                    setGames([response.data, ...games]);
                    showSuccess('Juego creado');
                } else {
                    showError(response.message || 'Error al crear el juego');
                }
            }

            // Resetear formulario
            setIsFormOpen(false);
            setEditingGame(null);
            setFormData({ name: '', description: '', iconUrl: '', releaseDate: '' });

        } catch (error) {
            console.error('Error:', error);
            showError('Error al guardar el juego');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!gameToDelete) return;

        try {
            setIsDeleteLoading(true);
            const response = await adminGameService.deleteGame(gameToDelete.id);

            if (response.success) {
                setGames(games.filter(g => g.id !== gameToDelete.id));
                showSuccess('Juego eliminado');
            } else {
                showError(response.message || 'Error');
            }

            setDeleteConfirmOpen(false);
            setGameToDelete(null);
        } catch (error) {
            console.error('Error:', error);
            showError('Error al eliminar');
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const openForm = (game?: Game) => {
        if (game) {
            setEditingGame(game);
            setFormData({
                name: game.name,
                description: game.description || '',
                iconUrl: game.iconUrl || '',
                releaseDate: game.releaseDate || '',
            });
        } else {
            setEditingGame(null);
            setFormData({ name: '', description: '', iconUrl: '', releaseDate: '' });
        }
        setIsFormOpen(true);
    };

    if (loading) {
        return <div className="text-center py-12">Cargando...</div>;
    }

    console.log('Estado actual de games:', games);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Juegos ({games.length})</h3>
                <button
                    onClick={() => openForm()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg text-sm font-medium"
                >
                    + Crear Juego
                </button>
            </div>

            {/* Grid de juegos */}
            {games.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    No hay juegos. Crea uno para comenzar.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map((game) => {
                        console.log('Renderizando juego:', game);
                        return (

                            <div key={game.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition">
                                {game.iconUrl && (
                                    <img
                                        src={game.iconUrl}
                                        alt={game.name}
                                        className="w-full h-40 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <h4 className="text-lg font-semibold mb-2">{game.name}</h4>
                                {game.description && (
                                    <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                                )}
                                {game.releaseDate && (
                                    <p className="text-gray-400 text-xs mb-4">
                                        Lanzamiento: {new Date(game.releaseDate).toLocaleDateString()}
                                    </p>
                                )}
                                <div className="flex gap-2 pt-4 border-t border-gray-600">
                                    <button
                                        onClick={() => openForm(game)}
                                        className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 transition rounded text-sm"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setGameToDelete(game);
                                            setDeleteConfirmOpen(true);
                                        }}
                                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 transition rounded text-sm"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-6">
                            {editingGame ? 'Editar Juego' : 'Crear Nuevo Juego'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
                                    placeholder="Nombre del juego"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
                                    placeholder="Descripción..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL del Icono</label>
                                <input
                                    type="url"
                                    value={formData.iconUrl}
                                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
                                    placeholder="URL de imagen"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Fecha de Lanzamiento</label>
                                <input
                                    type="date"
                                    value={formData.releaseDate}
                                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 px-4 py-2 rounded border border-gray-600 hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
                                >
                                    {submitting ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                title="Eliminar Juego"
                message={`¿Estás seguro de que deseas eliminar el juego "${gameToDelete?.name}"?`}
                confirmText="Eliminar"
                isDangerous={true}
                isLoading={isDeleteLoading}
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleteConfirmOpen(false);
                    setGameToDelete(null);
                }}
            />
        </div>
    );
};

export default AdminGamesTab;
