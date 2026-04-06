package com.tournaments.application.mapper;

import com.tournaments.domain.model.TicketReservation;
import com.tournaments.infrastructure.persistence.entities.TicketReservationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TicketReservationMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "tournament.id", target = "tournamentId")
    TicketReservation toDomain(TicketReservationEntity entity);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "tournamentId", target = "tournament.id")
    TicketReservationEntity toEntity(TicketReservation domain);
}
