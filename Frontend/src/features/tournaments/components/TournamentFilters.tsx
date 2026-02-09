import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { TournamentStatus, TournamentFilters as TournamentFiltersType } from '../../../types';
import { tournamentSortOptions, TournamentSortOption } from '../../../api/tournamentApi';
import { useDebounce } from '../../../hooks/useDebounce';

interface TournamentFiltersProps {
    onFilterChange: (filters: TournamentFiltersType) => void;
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    onSearchChange: (searchTerm: string) => void;
    initialFilters?: TournamentFiltersType;
    className?: string;
    isMobile?: boolean;
}

const TournamentFilters: React.FC<TournamentFiltersProps> = ({
    onFilterChange,
    onSortChange,
    onSearchChange,
    initialFilters = {},
    className = '',
    isMobile = false,
}) => {
    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
    const [status, setStatus] = useState<TournamentStatus | undefined>(initialFilters.status);
    const [isActive, setIsActive] = useState<boolean | undefined>(initialFilters.isActive);
    const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({
        start: initialFilters.startDate,
        end: initialFilters.endDate,
    });
    const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({
        min: initialFilters.minPrice,
        max: initialFilters.maxPrice,
    });
    const [sortBy, setSortBy] = useState<TournamentSortOption>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Estado para mostrar/ocultar filtros en móvil
    const [showFilters, setShowFilters] = useState(!isMobile);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Debounce para búsqueda
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Opciones de estado
    const statusOptions = [
        { value: undefined, label: 'Todos los estados' },
        { value: TournamentStatus.DRAFT, label: 'Borrador' },
        { value: TournamentStatus.OPEN, label: 'Inscripciones Abiertas' },
        { value: TournamentStatus.RUNNING, label: 'En Curso' },
        { value: TournamentStatus.COMPLETED, label: 'Completado' },
        { value: TournamentStatus.CANCELLED, label: 'Cancelado' },
    ];

    // Opciones de estado activo
    const activeOptions = [
        { value: undefined, label: 'Todos' },
        { value: true, label: 'Activos' },
        { value: false, label: 'Inactivos' },
    ];

    // Aplicar filtros cuando cambian los valores
    useEffect(() => {
        const filters: TournamentFiltersType = {
            search: debouncedSearchTerm || undefined,
            status,
            isActive,
            startDate: dateRange.start,
            endDate: dateRange.end,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
        };

        onFilterChange(filters);
    }, [debouncedSearchTerm, status, isActive, dateRange, priceRange, onFilterChange]);

    // Aplicar ordenamiento
    useEffect(() => {
        onSortChange(sortBy, sortOrder);
    }, [sortBy, sortOrder, onSortChange]);

    // Manejar búsqueda
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        onSearchChange(value);
    };

    // Limpiar todos los filtros
    const clearFilters = () => {
        setSearchTerm('');
        setStatus(undefined);
        setIsActive(undefined);
        setDateRange({});
        setPriceRange({});
        setSortBy('createdAt');
        setSortOrder('desc');
        setShowFilters(!isMobile);
    };

    // Formatear fecha para input date
    const formatDateForInput = (date?: string) => {
        if (!date) return '';
        return date.split('T')[0];
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Barra de búsqueda y controles superiores */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Buscador */}
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Buscar torneos por nombre o descripción..."
                        className="w-full pl-10 pr-4 py-3 bg-dark-light border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => handleSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Botón para mostrar/ocultar filtros en móvil */}
                {isMobile && (
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark rounded-lg text-white font-medium transition-colors"
                    >
                        <FunnelIcon className="w-5 h-5" />
                        Filtros
                    </button>
                )}

                {/* Ordenamiento */}
                <div className="flex items-center gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as TournamentSortOption)}
                        className="px-4 py-3 bg-dark-light border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {tournamentSortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                Ordenar por: {option.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-4 py-3 bg-dark-light border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors"
                        title={sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {/* Filtros (condicionalmente visibles) */}
            {showFilters && (
                <div className="bg-dark-light border border-gray-800 rounded-xl p-6 space-y-6">
                    {/* Encabezado de filtros */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-white">Filtros Avanzados</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                {isAdvancedOpen ? 'Menos opciones' : 'Más opciones'}
                            </button>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                                <XMarkIcon className="w-4 h-4" />
                                Limpiar filtros
                            </button>
                        </div>
                    </div>

                    {/* Filtros básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Estado del torneo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Estado del Torneo
                            </label>
                            <select
                                value={status || ''}
                                onChange={(e) => setStatus(e.target.value as TournamentStatus || undefined)}
                                className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.label} value={option.value || ''}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estado activo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Estado Activo
                            </label>
                            <select
                                value={isActive?.toString() || ''}
                                onChange={(e) => setIsActive(e.target.value === '' ? undefined : e.target.value === 'true')}
                                className="w-full px-3 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {activeOptions.map((option) => (
                                    <option key={option.label} value={option.value?.toString() || ''}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha de inicio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha de Inicio
                            </label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={formatDateForInput(dateRange.start)}
                                    onChange={(e) => setDateRange(prev => ({
                                        ...prev,
                                        start: e.target.value || undefined
                                    }))}
                                    className="w-full pl-10 pr-3 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filtros avanzados */}
                    {isAdvancedOpen && (
                        <div className="pt-6 border-t border-gray-800 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <CurrencyDollarIcon className="w-5 h-5 text-primary" />
                                <h4 className="text-md font-medium text-white">Rango de Precios</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Precio mínimo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Precio Mínimo
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={priceRange.min || ''}
                                            onChange={(e) => setPriceRange(prev => ({
                                                ...prev,
                                                min: e.target.value ? parseFloat(e.target.value) : undefined
                                            }))}
                                            placeholder="0.00"
                                            className="w-full pl-10 pr-3 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                {/* Precio máximo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Precio Máximo
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={priceRange.max || ''}
                                            onChange={(e) => setPriceRange(prev => ({
                                                ...prev,
                                                max: e.target.value ? parseFloat(e.target.value) : undefined
                                            }))}
                                            placeholder="1000.00"
                                            className="w-full pl-10 pr-3 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fecha de fin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de Fin
                                </label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formatDateForInput(dateRange.end)}
                                        onChange={(e) => setDateRange(prev => ({
                                            ...prev,
                                            end: e.target.value || undefined
                                        }))}
                                        className="w-full pl-10 pr-3 py-2 bg-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Estadísticas de filtros aplicados */}
                    <div className="pt-4 border-t border-gray-800">
                        <div className="flex flex-wrap gap-2">
                            {status && (
                                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                    Estado: {statusOptions.find(o => o.value === status)?.label}
                                </span>
                            )}
                            {isActive !== undefined && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                    {isActive ? 'Activos' : 'Inactivos'}
                                </span>
                            )}
                            {dateRange.start && (
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                    Desde: {dateRange.start}
                                </span>
                            )}
                            {dateRange.end && (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                                    Hasta: {dateRange.end}
                                </span>
                            )}
                            {(priceRange.min !== undefined || priceRange.max !== undefined) && (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                                    Precio: ${priceRange.min || 0} - ${priceRange.max || '∞'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TournamentFilters;