package com.tournaments.application.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.tournaments.application.service.ReservationService;
import com.tournaments.application.usecase.CreatePaymentUseCase;
import com.tournaments.application.usecase.CreateReservationUseCase;
import com.tournaments.application.usecase.GetReservationByIdForUserUseCase;
import com.tournaments.application.usecase.GetReservationsByUserUseCase;
import com.tournaments.application.usecase.RefundReservationUseCase;
import com.tournaments.domain.model.Payment;
import com.tournaments.domain.model.TicketReservation;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.request.RefundReservationRequest;
import com.tournaments.presentation.response.RefundReservationResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final CreateReservationUseCase createReservationUseCase;
    private final CreatePaymentUseCase createPaymentUseCase;
    private final GetReservationsByUserUseCase getReservationsByUserUseCase;
    private final GetReservationByIdForUserUseCase getReservationByIdForUserUseCase;
    private final RefundReservationUseCase refundReservationUseCase;

    @Override
    public TicketReservation createReservation(UUID tournamentId, Long userId) {
        return createReservationUseCase.execute(tournamentId, userId);
    }

    @Override
    public Payment createPayment(UUID reservationId, Long userId) {
        return createPaymentUseCase.execute(reservationId, userId);
    }

    @Override
    public List<TicketReservation> getReservationsForUser(Long userId) {
        return getReservationsByUserUseCase.execute(userId);
    }
    
    @Override
    public TicketReservation getReservationByIdForUser(UUID reservationId, Long userId) {
        return getReservationByIdForUserUseCase.execute(reservationId, userId);
    }

    @Override
    public RefundReservationResponse refundReservation(UUID reservationId, RefundReservationRequest request,
            CustomUserDetails currentUser) {
        RefundReservationUseCase.RefundReservationResult result = refundReservationUseCase.execute(reservationId, currentUser);

        return RefundReservationResponse.builder()
                .tournamentId(result.getTournamentId())
                .reservationId(result.getReservationId())
                .paymentId(result.getPaymentId())
                .newReservationStatus(result.getNewReservationStatus())
                .refunded(result.isRefunded())
                .errorMessage(result.getErrorMessage())
                .build();
    }
}
