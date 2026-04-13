import React, { useState, useEffect } from 'react';
import { TournamentRequest, Game, TournamentStatus } from '../shared/types/api.types';

interface TournamentFormModalProps {
    isOpen: boolean;
    title?: string;
    initialData?: Partial<TournamentRequest> & { id?: string };
    games: Game[];
    onSubmit: (data: TournamentRequest) => void | Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const TournamentFormModal: React.FC<TournamentFormModalProps> = ({
    isOpen,
    title = 'Crear Torneo',
    initialData,
    games,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<TournamentRequest>({
        name: '',
        description: '',
        status: 'open',
        gameId: 0,
        tournamentFormatId: undefined,
        platformIds: [],
        priceClient: 0,
        pricePlayer: 0,
        isOnline: true,
        minPlayers: 2,
        maxPlayers: 100,
        startAt: '',
        endAt: '',
        images: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                status: initialData.status || 'open',
                gameId: initialData.gameId || 0,
                tournamentFormatId: initialData.tournamentFormatId,
                platformIds: initialData.platformIds || [],
                priceClient: initialData.priceClient ?? 0,
                pricePlayer: initialData.pricePlayer ?? 0,
                isOnline: initialData.isOnline ?? true,
                minPlayers: initialData.minPlayers ?? 2,
                maxPlayers: initialData.maxPlayers ?? 100,
                startAt: initialData.startAt || '',
                endAt: initialData.endAt || '',
                images: initialData.images || [],
            });
        } else {
            setFormData({
                name: '',
                description: '',
                status: 'open',
                gameId: 0,
                tournamentFormatId: undefined,
                platformIds: [],
                priceClient: 0,
                pricePlayer: 0,
                isOnline: true,
                minPlayers: 2,
                maxPlayers: 100,
                startAt: '',
                endAt: '',
                images: [],
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        if (formData.gameId === 0) newErrors.gameId = 'Debes seleccionar un juego';
        if (formData.priceClient < 0) newErrors.priceClient = 'El precio no puede ser negativo';
        if (formData.pricePlayer < 0) newErrors.pricePlayer = 'El precio no puede ser negativo';
        if (formData.minPlayers <= 0) newErrors.minPlayers = 'Mínimo 1 jugador';
        if (formData.maxPlayers < formData.minPlayers) newErrors.maxPlayers = 'Máx debe ser mayor que mín';

        // Validación de fechas (opcional)
        if (formData.startAt && formData.endAt) {
            const start = new Date(formData.startAt);
            const end = new Date(formData.endAt);
            if (start >= end) {
                newErrors.endAt = 'La fecha de fin debe ser posterior a la de inicio';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const dataToSend = {
                ...formData,
                images: formData.images.filter(url => url.trim() !== ''),
                capacity: formData.maxPlayers,
            };
            await onSubmit(dataToSend);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (field: keyof TournamentRequest, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Funciones para imágenes
    const addImageField = () => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    const removeImageField = (index: number) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    const updateImageField = (index: number, value: string) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            newImages[index] = value;
            return { ...prev, images: newImages };
        });
    };

    const allowedStatuses: TournamentStatus[] = ['draft', 'open', 'running', 'completed', 'cancelled'];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Torneo *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ej: Final del Torneo 2026"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Describe el torneo..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Juego */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Juego *
                        </label>
                        <select
                            value={formData.gameId}
                            onChange={(e) => handleChange('gameId', parseInt(e.target.value))}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.gameId ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value={0}>-- Selecciona un juego --</option>
                            {games.map((game) => (
                                <option key={game.id} value={game.id} className="text-gray-900 bg-white">
                                    {game.name}
                                </option>
                            ))}
                        </select>
                        {errors.gameId && <p className="text-red-500 text-xs mt-1">{errors.gameId}</p>}
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            value={formData.status || 'draft'}
                            onChange={(e) => handleChange('status', e.target.value as TournamentStatus)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        >
                            {allowedStatuses.map((status) => (
                                <option key={status} value={status} className="text-gray-900 bg-white">
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Precios */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio para Cliente
                            </label>
                            <input
                                type="number"
                                value={formData.priceClient}
                                onChange={(e) => handleChange('priceClient', parseFloat(e.target.value))}
                                step="0.01"
                                min="0"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.priceClient ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.priceClient && <p className="text-red-500 text-xs mt-1">{errors.priceClient}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio para Jugador
                            </label>
                            <input
                                type="number"
                                value={formData.pricePlayer}
                                onChange={(e) => handleChange('pricePlayer', parseFloat(e.target.value))}
                                step="0.01"
                                min="0"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.pricePlayer ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.pricePlayer && <p className="text-red-500 text-xs mt-1">{errors.pricePlayer}</p>}
                        </div>
                    </div>

                    {/* Jugadores */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mínimo de Jugadores
                            </label>
                            <input
                                type="number"
                                value={formData.minPlayers}
                                onChange={(e) => handleChange('minPlayers', parseInt(e.target.value))}
                                min="1"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.minPlayers ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.minPlayers && <p className="text-red-500 text-xs mt-1">{errors.minPlayers}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Máximo de Jugadores
                            </label>
                            <input
                                type="number"
                                value={formData.maxPlayers}
                                onChange={(e) => handleChange('maxPlayers', parseInt(e.target.value))}
                                min="1"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.maxPlayers ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.maxPlayers && <p className="text-red-500 text-xs mt-1">{errors.maxPlayers}</p>}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de inicio
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.startAt}
                                onChange={(e) => handleChange('startAt', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de fin
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.endAt}
                                onChange={(e) => handleChange('endAt', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${errors.endAt ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.endAt && <p className="text-red-500 text-xs mt-1">{errors.endAt}</p>}
                        </div>
                    </div>

                    {/* Online */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isOnline"
                            checked={formData.isOnline}
                            onChange={(e) => handleChange('isOnline', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isOnline" className="ml-2 text-sm font-medium text-gray-700">
                            Es un torneo en línea
                        </label>
                    </div>

                    {/* Imágenes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Imágenes (URLs)
                        </label>
                        {formData.images.map((url, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => updateImageField(index, e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    title="Eliminar imagen"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                            + Añadir imagen
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                            Introduce las URLs de las imágenes (banner, logo, etc.)
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading && (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                                </svg>
                            )}
                            {isLoading ? 'Guardando...' : 'Guardar Torneo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TournamentFormModal;