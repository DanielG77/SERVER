package com.tournaments.presentation.mapper;

import java.math.BigDecimal;

import com.tournaments.domain.model.TicketReservation;
import com.tournaments.presentation.dto.TicketReservationDTO;

public class TicketReservationMapper {

    public static TicketReservationDTO toDto(TicketReservation reservation) {
    if (reservation == null) return null;

    return TicketReservationDTO.builder()
        .id(reservation.getId())
        .tournamentId(reservation.getTournamentId())
        .userId(reservation.getUserId())
        .status(reservation.getStatus())
        .createdAt(reservation.getCreatedAt())
        .expiresAt(reservation.getExpiresAt())
        .tournamentName(reservation.getTournament() != null ? reservation.getTournament().getName() : "Torneo Sin Nombre")
        .amount(reservation.getTournament() != null ? reservation.getTournament().getPricePlayer() : BigDecimal.ZERO)
        .currency("eur")
        .build();
}
}
