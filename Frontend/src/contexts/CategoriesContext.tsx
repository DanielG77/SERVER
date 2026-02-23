import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useCategories } from '@/features/Filters/queries/useCategories.query';
import type { Category } from '@/shared/types/tournament.types';

interface CategoriesContextValue {
    categories: Category[] | undefined;
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
    const { data: categories, isLoading, error, refetch } = useCategories();

    const value = useMemo(
        () => ({ categories, isLoading, error, refetch }),
        [categories, isLoading, error, refetch]
    );

    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategoriesContext = () => {
    const context = useContext(CategoriesContext);
    if (context === undefined) {
        throw new Error('useCategoriesContext debe usarse dentro de CategoriesProvider');
    }
    return context;
};