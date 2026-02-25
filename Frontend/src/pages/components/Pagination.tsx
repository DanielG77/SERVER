import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems?: number; // puede venir undefined
    limit?: number;      // puede venir undefined
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems = 0,
    limit = 8,
    onPageChange,
    // onLimitChange,
}) => {
    // Valores seguros
    const safeTotalItems = Number(totalItems) || 0;
    const safeLimit = Number(limit) || 1;

    // Cálculo de totalPages sin NaN
    const totalPages = Math.max(1, Math.ceil(safeTotalItems / safeLimit));

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    // Mostrar botones solo si aplican
    const showPrevious = totalPages > 1 && currentPage > 1;
    const showNext = totalPages > 1 && currentPage < totalPages;

    return (
        <div className="flex items-center justify-center mt-6">
            <div className="flex gap-2 items-center">
                {showPrevious && (
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        aria-label="Previous page"
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        Previous
                    </button>
                )}

                <span className="px-3 py-1">
                    Page {currentPage} of {totalPages}
                </span>

                {showNext && (
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        aria-label="Next page"
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Pagination;