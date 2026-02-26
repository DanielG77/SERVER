package com.tournaments.application.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tournaments.application.dto.GameRequestDto;
import com.tournaments.application.dto.GameResponseDto;
import com.tournaments.application.service.AdminGameService;
import com.tournaments.domain.exception.ResourceNotFoundException;
import com.tournaments.infrastructure.persistence.entities.GameEntity;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaGameRepository;

/**
 * Implementación del servicio de juegos para administradores.
 */
@Service
@Transactional
public class AdminGameServiceImpl implements AdminGameService {

    private final JpaGameRepository gameRepository;

    // Usamos ISO_LOCAL_DATE ("yyyy-MM-dd")
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    public AdminGameServiceImpl(JpaGameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public GameResponseDto createGame(GameRequestDto request) {
        GameEntity game = new GameEntity();
        game.setName(request.getName());
        game.setDescription(request.getDescription());
        game.setIconUrl(request.getIconUrl());

        if (request.getReleaseDate() != null && !request.getReleaseDate().isBlank()) {
            game.setReleaseDate(parseDate(request.getReleaseDate()));
        }

        GameEntity saved = gameRepository.save(game);
        return mapToDto(saved);
    }

    @Override
    public Page<GameResponseDto> getAllGames(Pageable pageable) {
        return gameRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Override
    public Optional<GameResponseDto> getGameById(Long id) {
        return gameRepository.findById(id)
                .map(this::mapToDto);
    }

    @Override
    public GameResponseDto updateGame(Long id, GameRequestDto request) {
        GameEntity game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Juego no encontrado con ID: " + id));

        if (request.getName() != null) {
            game.setName(request.getName());
        }
        if (request.getDescription() != null) {
            game.setDescription(request.getDescription());
        }
        if (request.getIconUrl() != null) {
            game.setIconUrl(request.getIconUrl());
        }
        if (request.getReleaseDate() != null) {
            if (!request.getReleaseDate().isBlank()) {
                game.setReleaseDate(parseDate(request.getReleaseDate()));
            } else {
                game.setReleaseDate(null);
            }
        }

        GameEntity updated = gameRepository.save(game);
        return mapToDto(updated);
    }

    @Override
    public void deleteGame(Long id) {
        if (!gameRepository.existsById(id)) {
            throw new ResourceNotFoundException("Juego no encontrado con ID: " + id);
        }
        gameRepository.deleteById(id);
    }

    private GameResponseDto mapToDto(GameEntity entity) {
        return new GameResponseDto(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getIconUrl(),
                entity.getReleaseDate() != null ? entity.getReleaseDate().format(DATE_FORMATTER) : null
        );
    }

    /**
     * Parsea una fecha en formato ISO (yyyy-MM-dd) a LocalDate.
     * Lanza IllegalArgumentException con mensaje claro en caso de formato inválido.
     */
    private LocalDate parseDate(String dateStr) {
        try {
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Formato de fecha inválido para releaseDate. Se espera 'yyyy-MM-dd' (ej: 2026-02-25). Valor recibido: " + dateStr, ex);
        }
    }
}
