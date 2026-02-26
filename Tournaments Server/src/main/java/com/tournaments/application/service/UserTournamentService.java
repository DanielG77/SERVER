package com.tournaments.application.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tournaments.application.dto.TournamentRequestDto;
import com.tournaments.application.dto.TournamentResponseDto;

/**
 * Servicio para operaciones de torneo disponibles para usuarios normales.
 * Los usuarios pueden:
 * - Crear torneos (se les asigna como propietarios automáticamente)
 * - Ver solo los torneos que les pertenecen (activos)
 * - Actualizar solo sus propios torneos
 * - Eliminar (soft delete) solo sus propios torneos
 * 
 * Nota: Si un usuario intenta acceder a un torneo que no le pertenece,
 * se lanzará una UnauthorizedOperationException (403 Forbidden).
 */
public interface UserTournamentService {

    /**
     * Crea un nuevo torneo. El usuario autenticado se convierte automáticamente en el propietario.
     * 
     * @param request datos del torneo a crear
     * @param userId ID del usuario autenticado
     * @return el torneo creado
     */
    TournamentResponseDto createTournament(TournamentRequestDto request, Long userId);

    /**
     * Obtiene todos los torneos activos que pertenecen al usuario autenticado.
     * 
     * @param userId ID del usuario autenticado
     * @param pageable información de paginación
     * @return page de torneos del usuario
     */
    Page<TournamentResponseDto> getMyTournaments(Long userId, Pageable pageable);

    /**
     * Obtiene un torneo específico si pertenece al usuario autenticado.
     * Si el torneo no pertenece al usuario, lanza UnauthorizedOperationException.
     * 
     * @param tournamentId ID del torneo
     * @param userId ID del usuario autenticado
     * @return el torneo
     * @throws UnauthorizedOperationException si el torneo no pertenece al usuario
     */
    TournamentResponseDto getMyTournament(UUID tournamentId, Long userId);

    /**
     * Actualiza un torneo si pertenece al usuario autenticado.
     * Si el torneo no pertenece al usuario, lanza UnauthorizedOperationException.
     * 
     * @param tournamentId ID del torneo
     * @param request datos a actualizar
     * @param userId ID del usuario autenticado
     * @return el torneo actualizado
     * @throws UnauthorizedOperationException si el torneo no pertenece al usuario
     */
    TournamentResponseDto updateMyTournament(UUID tournamentId, TournamentRequestDto request, Long userId);

    /**
     * Realiza un soft delete del torneo si pertenece al usuario autenticado.
     * Si el torneo no pertenece al usuario, lanza UnauthorizedOperationException.
     * 
     * @param tournamentId ID del torneo
     * @param userId ID del usuario autenticado
     * @throws UnauthorizedOperationException si el torneo no pertenece al usuario
     */
    void softDeleteMyTournament(UUID tournamentId, Long userId);
}
