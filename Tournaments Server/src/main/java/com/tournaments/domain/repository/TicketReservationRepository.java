package com.tournaments.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.tournaments.domain.model.TicketReservation;

public interface TicketReservationRepository {
    TicketReservation save(TicketReservation ticketReservation);
    Optional<TicketReservation> findById(UUID id);
    List<TicketReservation> findByUserId(Long userId);
}
