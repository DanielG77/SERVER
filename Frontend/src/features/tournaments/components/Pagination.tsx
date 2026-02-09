import React from 'react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showPageNumbers?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
    showPageNumbers = true,
}) => {
    // Calcular páginas a mostrar
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        let prev = 0;
        for (const i of range) {
            if (prev) {
                if (i - prev === 2) {
                    rangeWithDots.push(prev + 1);
                } else if (i - prev !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {/* Información de página */}
            <div className="text-sm text-gray-400">
                Página <span className="font-semibold text-white">{currentPage}</span> de{' '}
                <span className="font-semibold text-white">{totalPages}</span>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
                {/* Primer página */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-dark-light border border-gray-700 text-gray-400 hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Primera página"
                >
                    <ChevronDoubleLeftIcon className="w-5 h-5" />
                </button>

                {/* Página anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-dark-light border border-gray-700 text-gray-400 hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {/* Números de página */}
                {showPageNumbers && (
                    <div className="flex items-center gap-1">
                        {pageNumbers.map((page, index) => (
                            typeof page === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => onPageChange(page)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${currentPage === page
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-dark-light border border-gray-700 text-gray-400 hover:text-white hover:border-primary'
                                        }`}
                                    aria-label={`Página ${page}`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={index} className="px-2 text-gray-500">
                                    {page}
                                </span>
                            )
                        ))}
                    </div>
                )}

                {/* Página siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-dark-light border border-gray-700 text-gray-400 hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>

                {/* Última página */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-dark-light border border-gray-700 text-gray-400 hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Última página"
                >
                    <ChevronDoubleRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// Componente de paginación simplificado para móvil
export const MobilePagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}) => {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-dark-light border border-gray-700 text-gray-400 hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
                <ChevronLeftIcon className="w-4 h-4" />
                Anterior
            </button>

            <span className="text-sm text-gray-400">
                Página {currentPage} de {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-dark-light border border-gray-700 text-gray-400 hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
                Siguiente
                <ChevronRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;