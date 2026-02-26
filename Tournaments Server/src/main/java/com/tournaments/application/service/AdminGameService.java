package com.tournaments.application.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tournaments.application.dto.GameRequestDto;
import com.tournaments.application.dto.GameResponseDto;

/**
 * Servicio para operaciones de juego disponibles solo para administradores.
 * Administradores pueden:
 * - Crear nuevos juegos
 * - Actualizar juegos existentes
 * - Eliminar juegos
 * - Ver todos los juegos
 */
public interface AdminGameService {

    /**
     * Crea un nuevo juego.
     */
    GameResponseDto createGame(GameRequestDto request);

    /**
     * Obtiene todos los juegos.
     */
    Page<GameResponseDto> getAllGames(Pageable pageable);

    /**
     * Obtiene un juego específico por ID.
     */
    Optional<GameResponseDto> getGameById(Long id);

    /**
     * Actualiza un juego existente.
     */
    GameResponseDto updateGame(Long id, GameRequestDto request);

    /**
     * Elimina un juego (eliminación física).
     * Nota: Puede resultar en errores de integridad referencial si el juego
     * está asociado a torneos. Considera usar soft delete o el valor por defecto.
     */
    void deleteGame(Long id);
}
