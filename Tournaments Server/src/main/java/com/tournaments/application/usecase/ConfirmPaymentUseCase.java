package com.tournaments.application.usecase;

import com.tournaments.domain.enums.ReservationStatus;
import com.tournaments.infrastructure.persistence.entities.PaymentEntity;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaPaymentRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTicketReservationRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfirmPaymentUseCase {

    private final JpaPaymentRepository paymentRepository;
    private final JpaTicketReservationRepository reservationRepository;
    private final JpaTournamentRepository tournamentRepository;

    @Transactional
    public void execute(String stripePaymentIntentId) {
        log.info("Processing payment confirmation for intent_id: {}", stripePaymentIntentId);

        // 1. Buscar el pago por el ID del PaymentIntent de Stripe
        PaymentEntity payment = paymentRepository.findByStripePaymentIntentId(stripePaymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found for intent_id: " + stripePaymentIntentId));

        var reservation = payment.getReservation();

        // 2. Validar idempotencia y estado de la reserva
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            log.warn("Reservation {} is not in PENDING state. Current state: {}. Skipping.",
                    reservation.getId(), reservation.getStatus());
            return; // Idempotencia: si ya está pagada o cancelada, no hacer nada.
        }

        // 3. Bloquear el torneo y actualizarlo
        var tournament = tournamentRepository.findByIdForUpdate(reservation.getTournament().getId())
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        // 4. Actualizar el estado de la reserva y el contador de tickets del torneo
        reservation.setStatus(ReservationStatus.PAID);
        tournament.setTicketsSold(tournament.getTicketsSold() + 1);

        // 5. Guardar los cambios
        reservationRepository.save(reservation);
        tournamentRepository.save(tournament);

        log.info("Reservation {} successfully marked as PAID. Tournament {} tickets sold: {}",
                reservation.getId(), tournament.getId(), tournament.getTicketsSold());
    }
}
