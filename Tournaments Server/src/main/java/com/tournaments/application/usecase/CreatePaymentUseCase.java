package com.tournaments.application.usecase;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.tournaments.domain.enums.ReservationStatus;
import com.tournaments.domain.model.Payment;
import com.tournaments.domain.model.TicketReservation;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.repository.PaymentRepository;
import com.tournaments.domain.repository.TicketReservationRepository;
import com.tournaments.domain.repository.TournamentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreatePaymentUseCase {

    private final TicketReservationRepository ticketReservationRepository;
    private final PaymentRepository paymentRepository;
    private final TournamentRepository tournamentRepository;

    @Transactional
    public Payment execute(UUID reservationId, Long userId) {
        // 1. Buscar y validar la reserva
        TicketReservation reservation = ticketReservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // 2. Validar que el usuario es el dueño de la reserva
        if (!reservation.getUserId().equals(userId)) {
            throw new SecurityException("User does not own this reservation.");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Reservation is not in PENDING state.");
        }

        if (reservation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Reservation has expired.");
        }

        // 3. Obtener el torneo para saber el precio
        Tournament tournament = tournamentRepository.findById(reservation.getTournamentId())
            .orElseThrow(() -> new RuntimeException("Tournament not found"));

        // 4. Crear PaymentIntent en Stripe
        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(tournament.getPricePlayer().longValue() * 100) // Stripe usa centavos
                        .setCurrency("usd") // O la moneda que corresponda
                        .putMetadata("reservation_id", reservation.getId().toString())
                        .putMetadata("tournament_id", tournament.getId().toString())
                        .build();
        
        PaymentIntent paymentIntent;
        try {
            paymentIntent = PaymentIntent.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("Error creating payment intent", e);
        }

        // 5. Guardar el pago en la base de datos
        Payment payment = Payment.builder()
                .reservationId(reservation.getId())
                .stripePaymentIntentId(paymentIntent.getId())
                .amount(tournament.getPricePlayer())
                .currency("eur")
                .status(paymentIntent.getStatus())
                .clientSecret(paymentIntent.getClientSecret())
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        savedPayment.setClientSecret(payment.getClientSecret());
        return savedPayment;



    }
}
