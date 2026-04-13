package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(TicketReservationRepositoryImpl.class);

    private final JpaTicketReservationRepository jpaTicketReservationRepository;
    private final JpaUserRepository jpaUserRepository;
    private final JpaTournamentRepository jpaTournamentRepository;


    @Override
    public TicketReservation save(TicketReservation domain) {
        // Validación crítica: si tenemos ID, debe ser una entidad existente
        if (domain.getId() != null) {
            // UPDATE case: cargar existente y actualizar
            TicketReservationEntity existing = jpaTicketReservationRepository.findById(domain.getId())
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + domain.getId()));
            
            // Actualizar solo los campos que pueden cambiar
            existing.setStatus(domain.getStatus());
            existing.setExpiresAt(domain.getExpiresAt());
            // NO cambiar user ni tournament - esas relaciones deben preservarse
            
            logger.info("Updating existing reservation {} to status {}", 
                domain.getId(), domain.getStatus());
            
            TicketReservationEntity updatedEntity = jpaTicketReservationRepository.save(existing);
            return TicketReservationMapper.toDomain(updatedEntity);
        } else {
            // INSERT case: crear nueva reserva
            UserEntity user = jpaUserRepository.findById(domain.getUserId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + domain.getUserId()));
            TournamentEntity tournament = jpaTournamentRepository.findById(domain.getTournamentId())
                    .orElseThrow(() -> new RuntimeException("Torneo no encontrado con id: " + domain.getTournamentId()));

            // Construir entidad JPA con las relaciones (nueva, sin ID)
            TicketReservationEntity entity = TicketReservationEntity.builder()
                    .user(user)
                    .tournament(tournament)
                    .status(domain.getStatus())
                    .expiresAt(domain.getExpiresAt())
                    .build();

            logger.info("Creating new reservation for user {} on tournament {}", 
                domain.getUserId(), domain.getTournamentId());
            
            TicketReservationEntity savedEntity = jpaTicketReservationRepository.save(entity);
            return TicketReservationMapper.toDomain(savedEntity);
        }
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

    @Override
    public List<TicketReservation> findByTournamentId(UUID tournamentId) {
        return jpaTicketReservationRepository.findByTournamentId(tournamentId).stream()
                .map(TicketReservationMapper::toDomain)
                .collect(Collectors.toList());
    }
}