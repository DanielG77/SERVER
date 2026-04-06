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
        // Valores por defecto temporales
        .tournamentName("Torneo Demo")           // puedes poner un texto genérico
        .amount(BigDecimal.valueOf(10.00))       // valor fijo, ej: 10.00
        .currency("eur")                         // moneda fija
        .build();
}
}
