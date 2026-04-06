package com.tournaments.application.usecase;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.tournaments.domain.model.TicketReservation;
import com.tournaments.domain.repository.TicketReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetReservationByIdForUserUseCase {

    private final TicketReservationRepository ticketReservationRepository;

    @Transactional(readOnly = true)
    public TicketReservation execute(UUID reservationId, Long userId) {
        TicketReservation reservation = ticketReservationRepository.findById(reservationId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));

        if (!reservation.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para ver esta reserva");
        }

        return reservation;
    }
}