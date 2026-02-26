package com.tournaments.application.service.impl;

import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.dto.TournamentRequestDto;
import com.tournaments.application.dto.TournamentResponseDto;
import com.tournaments.application.service.AdminTournamentService;
import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.infrastructure.persistence.entities.GameEntity;
import com.tournaments.infrastructure.persistence.entities.PlatformEntity;
import com.tournaments.infrastructure.persistence.entities.TournamentEntity;
import com.tournaments.infrastructure.persistence.entities.TournamentFormatEntity;
import com.tournaments.infrastructure.persistence.entities.UserEntity;
import com.tournaments.infrastructure.persistence.repositories.JpaUserRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaGameRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaPlatformRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentFormatRepository;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaTournamentRepository;

/**
 * Implementación del servicio de torneos para administradores.
 * Los administradores pueden:
 * - Ver, crear, actualizar y eliminar CUALQUIER torneo
 * - Ver torneos inactivos
 * - Asignar torneos a usuarios específicos
 */
@Service
@Transactional
public class AdminTournamentServiceImpl implements AdminTournamentService {

    private final JpaTournamentRepository tournamentRepository;
    private final JpaUserRepository userRepository;
    private final JpaGameRepository gameRepository;
    private final JpaTournamentFormatRepository formatRepository;
    private final JpaPlatformRepository platformRepository;

    public AdminTournamentServiceImpl(
            JpaTournamentRepository tournamentRepository,
            JpaUserRepository userRepository,
            JpaGameRepository gameRepository,
            JpaTournamentFormatRepository formatRepository,
            JpaPlatformRepository platformRepository) {
        this.tournamentRepository = tournamentRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.formatRepository = formatRepository;
        this.platformRepository = platformRepository;
    }

    @Override
    public TournamentResponseDto createTournament(TournamentRequestDto request, Long ownerId) {
        // Validar que el propietario existe
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + ownerId));

        // Validar que el juego existe
        GameEntity game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Juego no encontrado con ID: " + request.getGameId()));

        // Validar formato si se proporciona
        TournamentFormatEntity format = null;
        if (request.getTournamentFormatId() != null) {
            format = formatRepository.findById(request.getTournamentFormatId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Formato de torneo no encontrado con ID: " + request.getTournamentFormatId()));
        }

        // Crear la entidad del torneo
        TournamentEntity tournament = new TournamentEntity();
        tournament.setName(request.getName());
        tournament.setDescription(request.getDescription());
        tournament.setImages(request.getImages());
        tournament.setStatus(
                com.tournaments.domain.enums.TournamentStatus
                        .fromString(request.getStatus() != null ? request.getStatus() : "draft"));
        tournament.setPriceClient(request.getPriceClient());
        tournament.setPricePlayer(request.getPricePlayer());
        tournament.setStartAt(request.getStartAt());
        tournament.setEndAt(request.getEndAt());
        tournament.setSlug(generateSlug(request.getName()));
        tournament.setOwner(owner);
        tournament.setGame(game);
        tournament.setTournamentFormat(format);
        tournament.setIsOnline(request.getIsOnline() != null ? request.getIsOnline() : true);
        tournament.setMinPlayers(request.getMinPlayers() != null ? request.getMinPlayers() : 1);
        tournament.setMaxPlayers(request.getMaxPlayers());
        tournament.setIsActive(true);

        // Agregar plataformas si se proporcionan
        if (request.getPlatformIds() != null && !request.getPlatformIds().isEmpty()) {
            var platforms = platformRepository.findAllById(request.getPlatformIds());
            tournament.setPlatforms(platforms.stream().collect(Collectors.toSet()));
        }

        TournamentEntity saved = tournamentRepository.save(tournament);
        return mapToDto(saved);
    }

    @Override
    public Page<TournamentResponseDto> getAllTournaments(Pageable pageable) {
        return tournamentRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Override
    public TournamentResponseDto getTournamentById(UUID id) {
        TournamentEntity tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Torneo no encontrado con ID: " + id));
        return mapToDto(tournament);
    }

    @Override
    public TournamentResponseDto updateTournament(UUID id, TournamentRequestDto request) {
        TournamentEntity tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Torneo no encontrado con ID: " + id));

        // Actualizar campos
        if (request.getName() != null) {
            tournament.setName(request.getName());
        }
        if (request.getDescription() != null) {
            tournament.setDescription(request.getDescription());
        }
        if (request.getImages() != null) {
            tournament.setImages(request.getImages());
        }
        if (request.getStatus() != null) {
            tournament.setStatus(
                    com.tournaments.domain.enums.TournamentStatus.fromString(request.getStatus()));
        }
        if (request.getPriceClient() != null) {
            tournament.setPriceClient(request.getPriceClient());
        }
        if (request.getPricePlayer() != null) {
            tournament.setPricePlayer(request.getPricePlayer());
        }
        if (request.getStartAt() != null) {
            tournament.setStartAt(request.getStartAt());
        }
        if (request.getEndAt() != null) {
            tournament.setEndAt(request.getEndAt());
        }
        if (request.getGameId() != null) {
            GameEntity game = gameRepository.findById(request.getGameId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Juego no encontrado con ID: " + request.getGameId()));
            tournament.setGame(game);
        }
        if (request.getTournamentFormatId() != null) {
            TournamentFormatEntity format = formatRepository.findById(request.getTournamentFormatId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Formato de torneo no encontrado con ID: " + request.getTournamentFormatId()));
            tournament.setTournamentFormat(format);
        }
        if (request.getIsOnline() != null) {
            tournament.setIsOnline(request.getIsOnline());
        }
        if (request.getMinPlayers() != null) {
            tournament.setMinPlayers(request.getMinPlayers());
        }
        if (request.getMaxPlayers() != null) {
            tournament.setMaxPlayers(request.getMaxPlayers());
        }
        if (request.getPlatformIds() != null) {
            var platforms = platformRepository.findAllById(request.getPlatformIds());
            tournament.setPlatforms(platforms.stream().collect(Collectors.toSet()));
        }

        TournamentEntity updated = tournamentRepository.save(tournament);
        return mapToDto(updated);
    }

    @Override
    public void softDeleteTournament(UUID id) {
        TournamentEntity tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Torneo no encontrado con ID: " + id));
        tournament.setIsActive(false);
        tournamentRepository.save(tournament);
    }

    @Override
    public void hardDeleteTournament(UUID id) {
        if (!tournamentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Torneo no encontrado con ID: " + id);
        }
        tournamentRepository.deleteById(id);
    }

    // === HELPERS ===

    /**
     * Convierte una TournamentEntity a TournamentResponseDto.
     */
    private TournamentResponseDto mapToDto(TournamentEntity entity) {
        TournamentResponseDto dto = new TournamentResponseDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setImages(entity.getImages());
        dto.setStatus(entity.getStatus().name().toLowerCase());
        dto.setPriceClient(entity.getPriceClient());
        dto.setPricePlayer(entity.getPricePlayer());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setStartAt(entity.getStartAt());
        dto.setEndAt(entity.getEndAt());
        dto.setSlug(entity.getSlug());
        dto.setUserId(entity.getOwner().getId());
        dto.setOwnerUsername(entity.getOwner().getUsername());
        dto.setGameId(entity.getGame().getId());
        dto.setGameName(entity.getGame().getName());
        if (entity.getTournamentFormat() != null) {
            dto.setTournamentFormatId(entity.getTournamentFormat().getId());
            dto.setTournamentFormatName(entity.getTournamentFormat().getName());
        }
        dto.setIsOnline(entity.getIsOnline());
        dto.setMinPlayers(entity.getMinPlayers());
        dto.setMaxPlayers(entity.getMaxPlayers());
        if (entity.getPlatforms() != null) {
            dto.setPlatformIds(
                    entity.getPlatforms().stream()
                            .map(PlatformEntity::getId)
                            .collect(Collectors.toList()));
        }
        return dto;
    }

    /**
     * Genera un slug a partir del nombre del torneo.
     */
    private String generateSlug(String name) {
        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return slug.isEmpty() ? "tournament-" + UUID.randomUUID() : slug;
    }
}
