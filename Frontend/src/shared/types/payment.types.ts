export type ReservationStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';

export interface PaymentResponse {
    id: string;
    reservationId: string;
    amount: number;
    currency: string;
    clientSecret: string;
}

export interface Reservation {
    id: string;
    tournamentName: string;
    amount: number;
    currency: string;
    status: ReservationStatus;
    expiresAt: string; // ISO 8601 date string
    // Add other relevant reservation fields if needed
}
