package com.tournaments.application.usecase;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

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
import com.tournaments.application.service.StripeRefundService;
import com.tournaments.infrastructure.persistence.entities.PaymentEntity;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaPaymentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Caso de uso: Cancelar un torneo completamente y reembolsar todos los pagos COMPLETED.
 * 
 * ✅ FIXES IMPLEMENTADOS EN ESTA VERSION:
 * - Inyección de JpaPaymentRepository para actualizaciones directas
 * - Uso de findById() para cargar entity managed antes de actualizar
 * - Uso de saveAndFlush() para persistencia INMEDIATA en la transacción
 */
@Service
@RequiredArgsConstructor
public class CancelTournamentUseCase {

    private static final Logger logger = LoggerFactory.getLogger(CancelTournamentUseCase.class);

    private final TournamentRepository tournamentRepository;
    private final TicketReservationRepository ticketReservationRepository;
    private final PaymentRepository paymentRepository;
    private final JpaPaymentRepository jpaPaymentRepository;
    private final StripeRefundService stripeRefundService;

    // Constantes para estados
    private static final String PAYMENT_STATUS_SUCCEEDED = "succeeded";
    private static final String PAYMENT_STATUS_REFUNDED = "refunded";

    @Transactional
    public CancelTournamentResult execute(UUID tournamentId, CustomUserDetails currentUser) {
        // 1. Cargar el torneo
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new TournamentNotFoundException(
                        "Tournament not found with ID: " + tournamentId));

        // 2. Verificar autorización
        Long creatorId = tournament.getOwnerId();
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        boolean isCreator = creatorId.equals(currentUser.getId());

        if (!isAdmin && !isCreator) {
            logger.warn("Unauthorized cancel attempt: user {} tried to cancel tournament {}",
                    currentUser.getId(), tournamentId);
            throw new UnauthorizedOperationException(
                    "You are not authorized to cancel this tournament");
        }

        logger.info("Cancelación de torneo {} por usuario {}", tournamentId, currentUser.getId());
        logger.info("Autorización válida para usuario {}: isCreator={}, isAdmin={}",
                currentUser.getId(), isCreator, isAdmin);

        // 3. Verificar estado del torneo
        if (tournament.getStatus() == TournamentStatus.CANCELLED) {
            throw new InvalidTournamentStateException(
                    "Tournament is already CANCELLED");
        }
        if (tournament.getStatus() == TournamentStatus.COMPLETED) {
            throw new InvalidTournamentStateException(
                    "Cannot cancel a COMPLETED tournament");
        }

        // 4. Obtener todas las reservas del torneo
        List<TicketReservation> allReservations = ticketReservationRepository.findByTournamentId(tournamentId);

        // 5. Obtener todos los pagos asociados a estas reservas
        List<Payment> allPayments = new ArrayList<>();
        for (TicketReservation reservation : allReservations) {
            List<Payment> reservationPayments = paymentRepository.findByReservationId(reservation.getId());
            allPayments.addAll(reservationPayments);
        }

        // 6. Filtrar pagos con estado "succeeded"
        List<Payment> paymentsToRefund = allPayments.stream()
                .filter(p -> PAYMENT_STATUS_SUCCEEDED.equals(p.getStatus()))
                .collect(Collectors.toList());

        logger.info("Torneo {} lista para cancelación, encontrados {} pagos COMPLETED de {} totales",
                tournamentId, paymentsToRefund.size(), allPayments.size());

        // 7. Procesar reembolsos
        List<FailedRefund> failedRefunds = new ArrayList<>();
        List<Payment> successfullyRefunded = new ArrayList<>();

        for (Payment payment : paymentsToRefund) {
            try {
                // Verificar si ya está refundado
                if (PAYMENT_STATUS_REFUNDED.equals(payment.getStatus())) {
                    logger.info("Payment {} ya estaba reembolsado, se omite", payment.getId());
                    successfullyRefunded.add(payment);
                    continue;
                }

                // ✅ FIX #1: Generar idempotency key DETERMINÍSTICA (sin timestamp)
                String idempotencyKey = String.format("refund_%s_%s",
                        tournamentId, payment.getId());

                logger.info("Iniciando refund para payment {}: amount={}, idempotency_key={}",
                    payment.getId(), payment.getAmount(), idempotencyKey);

                // ✅ FIX #2: Capturar el RefundResult
                StripeRefundService.RefundResult refundResult = 
                    stripeRefundService.refundPayment(
                        payment.getStripePaymentIntentId(),
                        payment.getAmount(),
                        idempotencyKey
                    );

                // ✅ FIX #3: Validar que el refund fue exitoso
                if (!refundResult.isSuccess()) {
                    throw new PaymentRefundException(
                        payment.getId().toString(),
                        "Refund returned non-success status: " + refundResult.getStatus()
                    );
                }

                // ✅ FIX #4: Validar que Stripe refundó algo (amount > 0)
                if (refundResult.getAmount() != null && refundResult.getAmount() > 0) {
                    logger.info("Refund {} succeeded with amount {} for payment {}",
                        refundResult.getRefundId(), refundResult.getAmount(), payment.getId());
                    successfullyRefunded.add(payment);
                } else {
                    logger.warn("PAYMENT REFUND ISSUE: Refund {} has ZERO amount. PaymentIntent {} may not have captured charges.",
                        refundResult.getRefundId(), payment.getStripePaymentIntentId());
                    
                    throw new PaymentRefundException(
                        payment.getId().toString(),
                        String.format("Refund created (ID: %s) but refunded amount is 0.",
                            refundResult.getRefundId())
                    );
                }

            } catch (PaymentRefundException e) {
                logger.error("Fallo reembolso payment {}: {}", 
                        payment.getId(), e.getStripeErrorMessage());
                
                failedRefunds.add(FailedRefund.builder()
                        .paymentId(payment.getId())
                        .errorMessage(e.getStripeErrorMessage())
                        .build());
            }
        }

        // 8. Si hubo fallos, lanzar excepción
        if (!failedRefunds.isEmpty()) {
            logger.error("Fallo en al menos un reembolso durante cancelación del torneo {}",
                    tournamentId);
            String summaryMessage = String.format(
                    "Failed to refund %d payment(s) during tournament cancellation. Failures: %s",
                    failedRefunds.size(),
                    failedRefunds.stream()
                            .map(fr -> fr.paymentId + ": " + fr.errorMessage)
                            .collect(Collectors.joining("; ")));
            
            throw new PaymentRefundException("tournament_" + tournamentId, summaryMessage);
        }

        // ✅ FIX CRÍTICO #5: Actualizar status de pagos usando JpaPaymentRepository
        logger.info("=== UPDATING PAYMENT STATUS TO 'refunded' ===");
        int paymentUpdateCount = 0;
        
        for (Payment payment : successfullyRefunded) {
            try {
                // Cargar la entidad JPA desde la DB (managed context)
                PaymentEntity paymentEntity = jpaPaymentRepository.findById(payment.getId())
                        .orElseThrow(() -> new RuntimeException(
                                "Payment entity not found for ID: " + payment.getId()));

                logger.debug("Payment {} current status: {}", payment.getId(), paymentEntity.getStatus());

                // Actualizar SOLO el status
                paymentEntity.setStatus(PAYMENT_STATUS_REFUNDED);
                logger.info("Setting payment {} status to 'refunded'", payment.getId());

                // Usar saveAndFlush() para persistencia INMEDIATA
                jpaPaymentRepository.saveAndFlush(paymentEntity);
                paymentUpdateCount++;

                logger.info("✅ Payment {} successfully updated to 'refunded' and flushed to DB", 
                        payment.getId());

            } catch (Exception e) {
                logger.error("ERROR updating payment {} status: {}", payment.getId(), e.getMessage());
                throw new RuntimeException(
                        "Failed to update payment status for payment " + payment.getId(), e);
            }
        }

        logger.info("Successfully updated {} payments to REFUNDED status",
                paymentUpdateCount);

        // Actualizar todas las reservas a REFUNDED
        int reservationUpdateCount = 0;
        for (TicketReservation reservation : allReservations) {
            if (reservation.getId() == null) {
                logger.error("CRITICAL: Reservation has null ID");
                throw new IllegalStateException(
                    String.format("Cannot update reservation without ID: userId=%d, tournamentId=%s",
                        reservation.getUserId(), reservation.getTournamentId()));
            }
            
            reservation.setStatus(ReservationStatus.REFUNDED);
            ticketReservationRepository.save(reservation);
            reservationUpdateCount++;
            
            logger.debug("Updated reservation {} to REFUNDED", reservation.getId());
        }
        
        logger.info("Successfully updated {} reservations to REFUNDED status", reservationUpdateCount);

        logger.info("Torneo {} Cancelado exitosamente. Reembolsos: {}, Fallos: {}",
                tournamentId, successfullyRefunded.size(), failedRefunds.size());

        return CancelTournamentResult.builder()
                .tournamentId(tournamentId)
                .newStatus(TournamentStatus.CANCELLED.toString())
                .refundedCount(successfullyRefunded.size())
                .failedRefunds(failedRefunds)
                .build();
    }

    public static class CancelTournamentResult {
        private UUID tournamentId;
        private String newStatus;
        private int refundedCount;
        private List<FailedRefund> failedRefunds;

        public CancelTournamentResult() {}

        private CancelTournamentResult(UUID tournamentId, String newStatus, 
                int refundedCount, List<FailedRefund> failedRefunds) {
            this.tournamentId = tournamentId;
            this.newStatus = newStatus;
            this.refundedCount = refundedCount;
            this.failedRefunds = failedRefunds != null ? failedRefunds : new ArrayList<>();
        }

        public UUID getTournamentId() { return tournamentId; }
        public String getNewStatus() { return newStatus; }
        public int getRefundedCount() { return refundedCount; }
        public List<FailedRefund> getFailedRefunds() { return failedRefunds; }

        public static CancelTournamentResultBuilder builder() {
            return new CancelTournamentResultBuilder();
        }

        public static class CancelTournamentResultBuilder {
            private UUID tournamentId;
            private String newStatus;
            private int refundedCount;
            private List<FailedRefund> failedRefunds;

            public CancelTournamentResultBuilder tournamentId(UUID tournamentId) {
                this.tournamentId = tournamentId;
                return this;
            }

            public CancelTournamentResultBuilder newStatus(String newStatus) {
                this.newStatus = newStatus;
                return this;
            }

            public CancelTournamentResultBuilder refundedCount(int refundedCount) {
                this.refundedCount = refundedCount;
                return this;
            }

            public CancelTournamentResultBuilder failedRefunds(List<FailedRefund> failedRefunds) {
                this.failedRefunds = failedRefunds;
                return this;
            }

            public CancelTournamentResult build() {
                return new CancelTournamentResult(tournamentId, newStatus, refundedCount, failedRefunds);
            }
        }
    }

    public static class FailedRefund {
        private UUID paymentId;
        private String errorMessage;

        public FailedRefund() {}

        private FailedRefund(UUID paymentId, String errorMessage) {
            this.paymentId = paymentId;
            this.errorMessage = errorMessage;
        }

        public UUID getPaymentId() { return paymentId; }
        public String getErrorMessage() { return errorMessage; }

        public static FailedRefundBuilder builder() {
            return new FailedRefundBuilder();
        }

        public static class FailedRefundBuilder {
            private UUID paymentId;
            private String errorMessage;

            public FailedRefundBuilder paymentId(UUID paymentId) {
                this.paymentId = paymentId;
                return this;
            }

            public FailedRefundBuilder errorMessage(String errorMessage) {
                this.errorMessage = errorMessage;
                return this;
            }

            public FailedRefund build() {
                return new FailedRefund(paymentId, errorMessage);
            }
        }
    }
}
