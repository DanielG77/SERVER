package com.tournaments.infrastructure.persistence.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.tournaments.application.mapper.TicketReservationMapper;
import com.tournaments.domain.model.TicketReservation;
import com.tournaments.domain.repository.TicketReservationRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTicketReservationRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TicketReservationRepositoryAdapter implements TicketReservationRepository {

    private final JpaTicketReservationRepository jpaRepository;
    private final TicketReservationMapper mapper;

    @Override
    public TicketReservation save(TicketReservation ticketReservation) {
        var entity = mapper.toEntity(ticketReservation);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<TicketReservation> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<TicketReservation> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketReservation> findByTournamentId(UUID tournamentId) {
        return jpaRepository.findByTournamentId(tournamentId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
