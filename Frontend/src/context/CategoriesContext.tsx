import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Category {
    id: string;
    name: string;
    // Add other fields as needed
}

interface CategoriesContextType {
    categories: Category[];
    isLoading: boolean;
    error: any;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoriesProvider');
    }
    return context;
};

interface CategoriesProviderProps {
    children: React.ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/genres');
            return response.data.data || [];
        },
    });

    return (
        <CategoriesContext.Provider value={{ categories, isLoading, error }}>
            {children}
        </CategoriesContext.Provider>
    );
};