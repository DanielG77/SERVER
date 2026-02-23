import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/types/api.types';
import type { Category } from '@/shared/types/tournament.types';

type CategoriesResponse = ApiResponse<Category[]>;

const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await apiClient.get<CategoriesResponse>(ENDPOINTS.CATEGORIES);
    if (data.success) {
        return data.data;
    }
    throw new Error('Error al cargar las categorías');
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });
};