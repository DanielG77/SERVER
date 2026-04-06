import { useQuery } from '@tanstack/react-query';
import { reservationService } from '../services/reservationService';

export const useReservation = (reservationId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['reservation', reservationId],
        queryFn: () => reservationService.getReservationById(reservationId),
        enabled,
    });
};
