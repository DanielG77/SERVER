package com.tournaments.application.usecase;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.tournaments.domain.enums.ReservationStatus;
import com.tournaments.domain.exception.TicketReservationException;
import com.tournaments.domain.model.TicketReservation;
import com.tournaments.domain.model.Tournament;
import com.tournaments.domain.model.User;
import com.tournaments.domain.repository.TicketReservationRepository;
import com.tournaments.domain.repository.TournamentRepository;
import com.tournaments.domain.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateReservationUseCase {

    private final TournamentRepository tournamentRepository;
    private final TicketReservationRepository ticketReservationRepository;
    private final UserRepository userRepository;

    private static final int RESERVATION_EXPIRATION_MINUTES = 15;

    @Transactional
    public TicketReservation execute(UUID tournamentId, Long userId) {
        // 1. Bloquear y obtener el torneo
        Tournament tournament = tournamentRepository.findByIdForUpdate(tournamentId)
                .orElseThrow(() -> new TicketReservationException("Tournament not found", "TOURNAMENT_NOT_FOUND"));

        // 2. Validar capacidad
        if (tournament.getTicketsSold() >= tournament.getCapacity()) {
            throw new TicketReservationException("No tickets available", "NO_TICKETS");
        }

        // 3. Obtener el usuario
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TicketReservationException("User not found", "USER_NOT_FOUND"));

        // 4. Crear la reserva
        var reservation = TicketReservation.builder()
                .tournamentId(tournament.getId())
                .userId(user.getId())
                .status(ReservationStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusMinutes(RESERVATION_EXPIRATION_MINUTES))
                .build();

        // 5. Guardar y devolver la reserva
        return ticketReservationRepository.save(reservation);
    }
}