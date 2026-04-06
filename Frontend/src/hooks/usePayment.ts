import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';
import { PaymentResponse } from '../shared/types/payment.types';

export const usePayment = (): UseMutationResult<PaymentResponse, Error, string> => {
    return useMutation<PaymentResponse, Error, string>({
        mutationFn: (reservationId: string) => paymentService.initiatePayment(reservationId),
    });
};