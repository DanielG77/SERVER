import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';
import { ReservationStatus } from '../shared/types/payment.types';

const POLLING_INTERVAL = 3000; // 3 seconds
const POLLING_TIMEOUT = 60000; // 60 seconds

export const usePaymentStatus = (reservationId: string | null) => {
    const [isPolling, setIsPolling] = useState(true);

    const { data: reservation, error, isLoading } = useQuery({
        queryKey: ['reservationStatus', reservationId],
        queryFn: () => reservationService.getReservationById(reservationId!),
        enabled: !!reservationId && isPolling,
        refetchInterval: POLLING_INTERVAL,
    });

    useEffect(() => {
        if (!reservationId) return;

        const timeoutId = setTimeout(() => {
            setIsPolling(false);
        }, POLLING_TIMEOUT);

        if (reservation?.status === 'PAID' || reservation?.status === 'CANCELLED' || reservation?.status === 'EXPIRED') {
            setIsPolling(false);
            clearTimeout(timeoutId);
        }

        return () => clearTimeout(timeoutId);
    }, [reservation, reservationId]);

    const isFinalStatus = reservation?.status === 'PAID' || (!isPolling && reservation?.status === 'PENDING');

    return {
        reservation,
        isLoading: isLoading && isPolling,
        error,
        isPolling,
        isFinalStatus,
        status: reservation?.status,
    };
};
