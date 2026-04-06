package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository; // <- IMPORT CORRECTO

import com.tournaments.domain.model.TicketReservation;
import com.tournaments.domain.repository.TicketReservationRepository;
import com.tournaments.infrastructure.persistence.entities.TicketReservationEntity;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;
import com.tournaments.infrastructure.persistence.entities.UserEntity;
import com.tournaments.infrastructure.persistence.mappers.TicketReservationMapper;
import com.tournaments.infrastructure.persistence.repositories.JpaUserRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTicketReservationRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@Primary
public class TicketReservationRepositoryImpl implements TicketReservationRepository {

    private final JpaTicketReservationRepository jpaTicketReservationRepository;
    private final JpaUserRepository jpaUserRepository;
    private final JpaTournamentRepository jpaTournamentRepository;


    @Override
    public TicketReservation save(TicketReservation domain) {
        // Cargar entidades completas
        UserEntity user = jpaUserRepository.findById(domain.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + domain.getUserId()));
        TournamentEntity tournament = jpaTournamentRepository.findById(domain.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Torneo no encontrado con id: " + domain.getTournamentId()));

        // Construir entidad JPA con las relaciones
        TicketReservationEntity entity = TicketReservationEntity.builder()
                .user(user)
                .tournament(tournament)
                .status(domain.getStatus())
                .expiresAt(domain.getExpiresAt())
                .build();

        // Guardar
        TicketReservationEntity savedEntity = jpaTicketReservationRepository.save(entity);

        // Mapear de vuelta a dominio usando el mapper estático
        return TicketReservationMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<TicketReservation> findById(UUID id) {
        return jpaTicketReservationRepository.findById(id).map(TicketReservationMapper::toDomain);
    }

    @Override
    public List<TicketReservation> findByUserId(Long userId) {
        return jpaTicketReservationRepository.findByUserId(userId).stream()
                .map(TicketReservationMapper::toDomain)
                .collect(Collectors.toList());
    }
}