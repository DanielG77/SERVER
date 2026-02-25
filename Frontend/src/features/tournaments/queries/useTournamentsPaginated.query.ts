// src/features/tournaments/queries/useTournamentsPaginated.query.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import { TournamentsResponse } from '../../../shared/types/tournament.types';

type Filters = Record<string, any>;

const fetchPage = async (page: number, limit: number, filters: Filters) => {
    const params = { page, limit, ...filters };
    const { data } = await apiClient.get<TournamentsResponse>(ENDPOINTS.TOURNAMENTS, { params });
    return data;
};

// export const useTournamentsPaginated = (filters: Filters = {}, pageSize = 9) => {
//     return useInfiniteQuery(
//         ['tournaments', filters, pageSize],
//         async ({ pageParam = 1 }) => {
//             return fetchPage(pageParam, pageSize, filters);
//         },
//         // {
//         //     getNextPageParam: (lastPage) => {
//         //         const pagination = lastPage.meta?.pagination;
//         //         if (!pagination) return undefined;
//         //         const total = pagination.total;
//         //         const pageSize = pagination.pageSize ?? pageSize;
//         //         const current = pagination.page ?? 1;
//         //         const totalPages = Math.ceil(total / pageSize);
//         //         return current < totalPages ? current + 1 : undefined;
//         //     },
//         //     staleTime: 30_000,
//         //     cacheTime: 5 * 60_000,
//         // }
//     );
// };
