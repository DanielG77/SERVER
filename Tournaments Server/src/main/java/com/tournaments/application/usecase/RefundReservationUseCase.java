package com.tournaments.application.usecase;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.tournaments.application.service.StripeRefundService;
import com.tournaments.domain.enums.ReservationStatus;
import com.tournaments.domain.enums.TournamentStatus;
import com.tournaments.domain.exception.InvalidTournamentStateException;
import com.tournaments.domain.exception.PaymentRefundException;
import com.tournaments.domain.exception.TournamentNotFoundException;
import com.tournaments.domain.exception.UnauthorizedOperationException;
import com.tournaments.domain.model.Payment;
import com.tournaments.domain.model.TicketReservation;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.repository.PaymentRepository;
import com.tournaments.domain.repository.TicketReservationRepository;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.infrastructure.security.CustomUserDetails;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Caso de uso: Reembolsar una reserva individual.
 * 
 * Requisitos:
 * 1. El usuario debe estar autorizado: creador del torneo, admin, o propietario de la reserva
 * 2. El torneo debe estar en estado OPENED
 * 3. El pago debe estar en estado "succeeded" (completado)
 * 4. Si el pago ya está reembolsado, se omite sin error
 * 5. Si Stripe falla, se lanza PaymentRefundException y se revierte la transacción
 * 6. Si tiene éxito, la Reservation pasa a estado REFUNDED
 */
@Service
@RequiredArgsConstructor
public class RefundReservationUseCase {

    private static final Logger logger = LoggerFactory.getLogger(RefundReservationUseCase.class);

    private final TicketReservationRepository ticketReservationRepository;
    private final PaymentRepository paymentRepository;
    private final TournamentRepository tournamentRepository;
    private final StripeRefundService stripeRefundService;

    // Constantes para estados de pago
    private static final String PAYMENT_STATUS_SUCCEEDED = "succeeded";
    private static final String PAYMENT_STATUS_REFUNDED = "refunded";

    @Transactional
    public RefundReservationResult execute(UUID reservationId, CustomUserDetails currentUser) {
        // 1. Cargar la reserva
        TicketReservation reservation = ticketReservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + reservationId));

        // 2. Cargar el torneo
        Tournament tournament = tournamentRepository.findById(reservation.getTournamentId())
                .orElseThrow(() -> new TournamentNotFoundException(
                        "Tournament not found with ID: " + reservation.getTournamentId()));

        // 3. Verificar autorización
        // El usuario debe ser: creador del torneo, admin, o propietario de la reserva
        Long creatorId = tournament.getOwnerId(); // Necesitaremos que Tournament tenga este campo
        Long reservationOwnerId = reservation.getUserId();
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        boolean isCreator = creatorId.equals(currentUser.getId());
        boolean isReservationOwner = reservationOwnerId.equals(currentUser.getId());

        if (!isAdmin && !isCreator && !isReservationOwner) {
            logger.warn("Unauthorized refund attempt: user {} tried to refund reservation {} in tournament {}",
                    currentUser.getId(), reservationId, tournament.getId());
            throw new UnauthorizedOperationException(
                    "You are not authorized to refund this reservation");
        }

        logger.info("Reembolso aislado solicitado para reservation {} en torneo {}", reservationId, tournament.getId());
        logger.info("Autorización válida para usuario {}: isCreator={}, isAdmin={}, isReservationOwner={}",
                currentUser.getId(), isCreator, isAdmin, isReservationOwner);

        // 4. Verificar que el torneo está en estado OPENED
        if (tournament.getStatus() != TournamentStatus.OPEN) {
            logger.warn("Cannot refund reservation in tournament {} - tournament status is {} not OPENED",
                    tournament.getId(), tournament.getStatus());
            throw new InvalidTournamentStateException(
                    "Tournament must be in OPENED state to refund reservations. Current state: " + tournament.getStatus());
        }

        logger.info("Torneo {} sigue OPENED, reembolso aislado permitido", tournament.getId());

        // 5. Obtener el pago asociado a la reserva
        java.util.List<Payment> payments = paymentRepository.findByReservationId(reservationId);
        if (payments.isEmpty()) {
            throw new RuntimeException("No payment found for reservation: " + reservationId);
        }

        // Usar el primer pago (normalmente debería haber uno solo)
        Payment payment = payments.get(0);

        // 6. Verificar estado del pago
        if (!PAYMENT_STATUS_SUCCEEDED.equals(payment.getStatus())) {
            if (PAYMENT_STATUS_REFUNDED.equals(payment.getStatus())) {
                logger.info("Payment {} ya estaba reembolsado, se omite", payment.getId());
                // No es un error - solo se omite
                return RefundReservationResult.builder()
                        .tournamentId(tournament.getId())
                        .reservationId(reservationId)
                        .paymentId(payment.getId())
                        .newReservationStatus(ReservationStatus.REFUNDED.toString())
                        .refunded(true)
                        .errorMessage(null)
                        .build();
            } else {
                logger.warn("Payment {} has status {} - cannot refund (not SUCCEEDED)",
                        payment.getId(), payment.getStatus());
                throw new InvalidTournamentStateException(
                        "Payment must be in SUCCEEDED state to refund. Current state: " + payment.getStatus());
            }
        }

        // 7. Llamar a Stripe para reembolsar
        String idempotencyKey = String.format("refund_%s_%s_%d",
                tournament.getId(), payment.getId(), System.currentTimeMillis());

        try {
            logger.info("Reembolsando payment {} por {}", payment.getId(), payment.getAmount());

            stripeRefundService.refundPayment(
                    payment.getStripePaymentIntentId(),
                    payment.getAmount(),
                    idempotencyKey
            );

            // 8. Si Stripe tuvo éxito, actualizar el estado del pago y la reserva
            payment.setStatus(PAYMENT_STATUS_REFUNDED);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            reservation.setStatus(ReservationStatus.REFUNDED);
            ticketReservationRepository.save(reservation);

            logger.info("Refund exitoso para reservation {} - status updated to REFUNDED", reservationId);

            return RefundReservationResult.builder()
                    .tournamentId(tournament.getId())
                    .reservationId(reservationId)
                    .paymentId(payment.getId())
                    .newReservationStatus(ReservationStatus.REFUNDED.toString())
                    .refunded(true)
                    .errorMessage(null)
                    .build();

        } catch (PaymentRefundException e) {
            logger.error("Fallo reembolso payment {}: {}", payment.getId(), e.getStripeErrorMessage());
            // La transacción se revierte automáticamente debido a @Transactional
            // Re-lanzar la excepción para que sea manejada por la capa de presentación
            throw e;
        }
    }

    /**
     * DTO para el resultado del caso de uso
     */
    public static class RefundReservationResult {
        private UUID tournamentId;
        private UUID reservationId;
        private UUID paymentId;
        private String newReservationStatus;
        private boolean refunded;
        private String errorMessage;

        public RefundReservationResult() {}

        private RefundReservationResult(UUID tournamentId, UUID reservationId, UUID paymentId,
                String newReservationStatus, boolean refunded, String errorMessage) {
            this.tournamentId = tournamentId;
            this.reservationId = reservationId;
            this.paymentId = paymentId;
            this.newReservationStatus = newReservationStatus;
            this.refunded = refunded;
            this.errorMessage = errorMessage;
        }

        // Builder pattern
        public static RefundReservationResultBuilder builder() {
            return new RefundReservationResultBuilder();
        }

        public static class RefundReservationResultBuilder {
            private UUID tournamentId;
            private UUID reservationId;
            private UUID paymentId;
            private String newReservationStatus;
            private boolean refunded;
            private String errorMessage;

            public RefundReservationResultBuilder tournamentId(UUID tournamentId) {
                this.tournamentId = tournamentId;
                return this;
            }

            public RefundReservationResultBuilder reservationId(UUID reservationId) {
                this.reservationId = reservationId;
                return this;
            }

            public RefundReservationResultBuilder paymentId(UUID paymentId) {
                this.paymentId = paymentId;
                return this;
            }

            public RefundReservationResultBuilder newReservationStatus(String newReservationStatus) {
                this.newReservationStatus = newReservationStatus;
                return this;
            }

            public RefundReservationResultBuilder refunded(boolean refunded) {
                this.refunded = refunded;
                return this;
            }

            public RefundReservationResultBuilder errorMessage(String errorMessage) {
                this.errorMessage = errorMessage;
                return this;
            }

            public RefundReservationResult build() {
                return new RefundReservationResult(tournamentId, reservationId, paymentId,
                        newReservationStatus, refunded, errorMessage);
            }
        }

        // Getters
        public UUID getTournamentId() { return tournamentId; }
        public UUID getReservationId() { return reservationId; }
        public UUID getPaymentId() { return paymentId; }
        public String getNewReservationStatus() { return newReservationStatus; }
        public boolean isRefunded() { return refunded; }
        public String getErrorMessage() { return errorMessage; }
    }
}
