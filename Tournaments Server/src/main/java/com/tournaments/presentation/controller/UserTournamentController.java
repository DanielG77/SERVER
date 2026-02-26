package com.tournaments.presentation.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.TournamentRequestDto;
import com.tournaments.application.dto.TournamentResponseDto;
import com.tournaments.application.service.UserTournamentService;
import com.tournaments.infrastructure.security.CustomUserDetails;
import com.tournaments.presentation.response.ApiResponse;

/**
 * Controlador REST para operaciones de torneos para usuarios normales.
 * Los usuarios pueden gestionar solo sus propios torneos.
 * Ruta: /api/user/tournaments
 */
@RestController
@RequestMapping("/api/user/tournaments")
@PreAuthorize("hasRole('CLIENT')")
public class UserTournamentController {

    private final UserTournamentService userTournamentService;

    public UserTournamentController(UserTournamentService userTournamentService) {
        this.userTournamentService = userTournamentService;
    }

    /**
     * POST /api/user/tournaments
     * Crea un nuevo torneo. El usuario autenticado se convierte en propietario.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TournamentResponseDto>> createTournament(
            @RequestBody TournamentRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getId();
        TournamentResponseDto created = userTournamentService.createTournament(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Torneo creado exitosamente"));
    }

    /**
     * GET /api/user/tournaments
     * Obtiene todos los torneos activos que pertenecen al usuario autenticado.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TournamentResponseDto>>> getMyTournaments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<TournamentResponseDto> tournaments = userTournamentService.getMyTournaments(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(tournaments, "Tus torneos"));
    }

    /**
     * GET /api/user/tournaments/{id}
     * Obtiene un torneo específico si pertenece al usuario autenticado.
     * Si el torneo no pertenece al usuario, retorna 403 Forbidden.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TournamentResponseDto>> getMyTournament(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getId();
        TournamentResponseDto tournament = userTournamentService.getMyTournament(id, userId);
        return ResponseEntity.ok(ApiResponse.success(tournament, "Torneo obtenido"));
    }

    /**
     * PUT /api/user/tournaments/{id}
     * Actualiza un torneo si pertenece al usuario autenticado.
     * Si el torneo no pertenece al usuario, retorna 403 Forbidden.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TournamentResponseDto>> updateMyTournament(
            @PathVariable UUID id,
            @RequestBody TournamentRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getId();
        TournamentResponseDto updated = userTournamentService.updateMyTournament(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success(updated, "Torneo actualizado exitosamente"));
    }

    /**
     * DELETE /api/user/tournaments/{id}
     * Realiza un soft delete del torneo si pertenece al usuario autenticado.
     * Si el torneo no pertenece al usuario, retorna 403 Forbidden.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMyTournament(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((CustomUserDetails) userDetails).getId();
        userTournamentService.softDeleteMyTournament(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Torneo eliminado exitosamente"));
    }
}
