import api from '../services/api';
import { Reservation } from '../shared/types/payment.types';

export const reservationService = {
    // reservationService.ts
    createReservation: async (tournamentId: string): Promise<Reservation> => {
        const response = await api.post(`/api/tournaments/${tournamentId}/reservations`);
        return response.data;
    },
    getReservationById: async (reservationId: string): Promise<Reservation> => {
        const response = await api.get(`/api/reservations/${reservationId}`);
        return response.data;
    },
    getUserReservations: async (): Promise<Reservation[]> => {
        const response = await api.get(`/api/reservations`);
        return response.data;
    },
    getMyReservations: async () => {
        try {
            const res = await api.get('/api/reservations');
            return {
                success: true,
                data: res.data,
                message: null
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || 'Error al obtener reservas'
            };
        }
    }
};
