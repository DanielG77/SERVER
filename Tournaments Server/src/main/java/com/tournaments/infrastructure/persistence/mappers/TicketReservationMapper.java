package com.tournaments.infrastructure.persistence.mappers;

import java.util.stream.Collectors;

import com.tournaments.domain.model.TicketReservation;
import com.tournaments.infrastructure.persistence.entities.TicketReservationEntity;

public class TicketReservationMapper {

    public static TicketReservation toDomain(TicketReservationEntity entity) {
        if (entity == null) {
            return null;
        }
        return TicketReservation.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .tournamentId(entity.getTournament().getId())
                .tournament(TournamentMapper.toDomain(entity.getTournament()))
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .expiresAt(entity.getExpiresAt())
                .payments(entity.getPayments() != null ? entity.getPayments().stream().map(PaymentMapper::toDomain).collect(Collectors.toList()) : null)
                .build();
    }

    public static TicketReservationEntity toEntity(TicketReservation domain) {
        if (domain == null) {
            return null;
        }
        TicketReservationEntity entity = new TicketReservationEntity();
        entity.setId(domain.getId());
        // User and Tournament are set by their IDs in the use case
        entity.setStatus(domain.getStatus());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setExpiresAt(domain.getExpiresAt());
        return entity;
    }
}
