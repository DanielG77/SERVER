import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../shared/api/client';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { TournamentsResponse, Tournament } from '../../../shared/types/tournament.types';

const fetchTournaments = async (): Promise<Tournament[]> => {
    const { data } = await apiClient.get<TournamentsResponse>(ENDPOINTS.TOURNAMENTS);
    if (data.success) {
        return data.data;
    }
    throw new Error('Failed to fetch tournaments');
};

export const useTournaments = () => {
    return useQuery({
        queryKey: ['tournaments'],
        queryFn: fetchTournaments,
    });
};