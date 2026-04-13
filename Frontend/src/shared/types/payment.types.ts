export type ReservationStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'CANCELLED' | 'EXPIRED';

export interface PaymentResponse {
    id: string;
    reservationId: string;
    amount: number;
    currency: string;
    status: string;  // "succeeded", "refunded", etc.
    updatedAt?: string;  // ISO 8601 date string
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
