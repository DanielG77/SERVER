package com.tournaments.application.service.impl;

import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.dto.TournamentRequestDto;
import com.tournaments.application.dto.TournamentResponseDto;
import com.tournaments.application.service.UserTournamentService;
import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.domain.exception.UnauthorizedOperationException;
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
 * Implementación del servicio de torneos para usuarios normales.
 * Los usuarios pueden:
 * - Crear torneos (automáticamente los convierte en propietarios)
 * - Ver solo SUS torneos activos
 * - Actualizar solo SUS torneos
 * - Eliminar (soft delete) solo SUS torneos
 * 
 * Si un usuario intenta acceder a un torneo que no le pertenece,
 * se lanza UnauthorizedOperationException (HTTP 403 Forbidden).
 */
@Service
@Transactional
public class UserTournamentServiceImpl implements UserTournamentService {

    private final JpaTournamentRepository tournamentRepository;
    private final JpaUserRepository userRepository;
    private final JpaGameRepository gameRepository;
    private final JpaTournamentFormatRepository formatRepository;
    private final JpaPlatformRepository platformRepository;

    public UserTournamentServiceImpl(
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
    public TournamentResponseDto createTournament(TournamentRequestDto request, Long userId) {
        // Validar que el usuario existe
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + userId));

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

        // Crear la entidad del torneo con el usuario como propietario
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
        tournament.setOwner(user); // El usuario autenticado es el propietario
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
    public Page<TournamentResponseDto> getMyTournaments(Long userId, Pageable pageable) {
        // Obtener solo torneos activos que pertenecen al usuario
        return tournamentRepository.findByOwnerIdAndIsActive(userId, true, pageable)
                .map(this::mapToDto);
    }

    @Override
    public TournamentResponseDto getMyTournament(UUID tournamentId, Long userId) {
        // Verificar que el usuario es el propietario del torneo
        TournamentEntity tournament = tournamentRepository.findByIdAndOwnerId(tournamentId, userId)
                .orElseThrow(() -> new UnauthorizedOperationException(
                        "No tienes permiso para acceder a este torneo"));
        return mapToDto(tournament);
    }

    @Override
    public TournamentResponseDto updateMyTournament(UUID tournamentId, TournamentRequestDto request, Long userId) {
        // Verificar que el usuario es el propietario
        TournamentEntity tournament = tournamentRepository.findByIdAndOwnerId(tournamentId, userId)
                .orElseThrow(() -> new UnauthorizedOperationException(
                        "No tienes permiso para actualizar este torneo"));

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
    public void softDeleteMyTournament(UUID tournamentId, Long userId) {
        // Verificar que el usuario es el propietario
        TournamentEntity tournament = tournamentRepository.findByIdAndOwnerId(tournamentId, userId)
                .orElseThrow(() -> new UnauthorizedOperationException(
                        "No tienes permiso para eliminar este torneo"));

        tournament.setIsActive(false);
        tournamentRepository.save(tournament);
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
