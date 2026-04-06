package com.tournaments.application.service;

import java.util.List;
import java.util.UUID;

import com.tournaments.domain.model.Payment;
import com.tournaments.domain.model.TicketReservation;

public interface ReservationService {
    /**
     * Creates a ticket reservation for a specific tournament and user.
     *
     * @param tournamentId The ID of the tournament.
     * @param userId The ID of the user making the reservation.
     * @return The created TicketReservation.
     */
    TicketReservation createReservation(UUID tournamentId, Long userId);

    /**
     * Creates a payment intent for a given reservation.
     *
     * @param reservationId The ID of the reservation to pay for.
     * @param userId The ID of the user who owns the reservation.
     * @return The created Payment object containing the Stripe client secret.
     */
    Payment createPayment(UUID reservationId, Long userId);

    /**
     * Retrieves all reservations for a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of the user's ticket reservations.
     */
    List<TicketReservation> getReservationsForUser(Long userId);

    TicketReservation getReservationByIdForUser(UUID reservationId, Long userId);
}
