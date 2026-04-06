import api from '../services/api';
import { PaymentResponse } from '../shared/types/payment.types';

export const paymentService = {
    initiatePayment: async (reservationId: string): Promise<PaymentResponse> => {
        // Agregamos el prefijo /api
        const response = await api.post<PaymentResponse>(`/api/reservations/${reservationId}/payments`);
        return response.data;
    },
};