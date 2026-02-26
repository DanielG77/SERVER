package com.tournaments.application.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tournaments.application.dto.TournamentRequestDto;
import com.tournaments.application.dto.TournamentResponseDto;

/**
 * Servicio para operaciones de torneo disponibles solo para administradores.
 * Administradores pueden:
 * - Ver todos los torneos (activos e inactivos)
 * - Crear torneos (sin propietario específico o asignando a un usuario)
 * - Actualizar cualquier torneo
 * - Eliminar (soft delete) cualquier torneo
 */
public interface AdminTournamentService {

    /**
     * Crea un nuevo torneo. El admin puede asignar el torneo a cualquier usuario.
     */
    TournamentResponseDto createTournament(TournamentRequestDto request, Long ownerId);

    /**
     * Obtiene todos los torneos (activos e inactivos).
     */
    Page<TournamentResponseDto> getAllTournaments(Pageable pageable);

    /**
     * Obtiene un torneo específico por ID.
     */
    TournamentResponseDto getTournamentById(UUID id);

    /**
     * Actualiza un torneo existente.
     */
    TournamentResponseDto updateTournament(UUID id, TournamentRequestDto request);

    /**
     * Realiza un soft delete del torneo (is_active = false).
     */
    void softDeleteTournament(UUID id);

    /**
     * Realiza un hard delete del torneo (eliminación física de la BD).
     * Úsalo con cuidado - esta acción es irreversible.
     */
    void hardDeleteTournament(UUID id);
}
