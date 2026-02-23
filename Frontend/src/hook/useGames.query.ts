import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/types/api.types';

export interface Game {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
    releaseDate: string;
    genres: Array<{ id: number; name: string }>;
}

type GamesResponse = ApiResponse<Game[]>;

const fetchGames = async (): Promise<Game[]> => {
    const { data } = await apiClient.get<GamesResponse>(ENDPOINTS.GAMES);
    if (data.success) {
        return data.data;
    }
    throw new Error('Error al cargar los juegos');
};

export const useGames = () => {
    return useQuery({
        queryKey: ['games'],
        queryFn: fetchGames,
    });
};