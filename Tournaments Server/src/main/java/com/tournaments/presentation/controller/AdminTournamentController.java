package com.tournaments.presentation.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // ✅ IMPORT
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody; // ✅ IMPORT
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.TournamentRequestDto;
import com.tournaments.application.dto.TournamentResponseDto;
import com.tournaments.application.service.AdminTournamentService;
import com.tournaments.infrastructure.persistence.entities.UserEntity;
import com.tournaments.infrastructure.persistence.repositories.JpaUserRepository;
import com.tournaments.presentation.response.ApiResponse;

@RestController
@RequestMapping("/api/admin/tournaments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTournamentController {

    private final AdminTournamentService adminTournamentService;
    private final JpaUserRepository userRepository; // ✅ DECLARAR

    public AdminTournamentController(
            AdminTournamentService adminTournamentService,
            JpaUserRepository userRepository) { // ✅ INYECTAR
        this.adminTournamentService = adminTournamentService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TournamentResponseDto>> createTournament(
            @RequestBody TournamentRequestDto request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }

        String username = auth.getName();

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        TournamentResponseDto created =
                adminTournamentService.createTournament(request, user.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Torneo creado correctamente"));
    }

    /**
     * GET /api/admin/tournaments
     * Obtiene todos los torneos (activos e inactivos) con paginación.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TournamentResponseDto>>> getAllTournaments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TournamentResponseDto> tournaments = adminTournamentService.getAllTournaments(pageable);
        return ResponseEntity.ok(ApiResponse.success(tournaments, "Torneos obtenidos"));
    }

    /**
     * GET /api/admin/tournaments/{id}
     * Obtiene un torneo específico por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TournamentResponseDto>> getTournamentById(
            @PathVariable UUID id) {

        TournamentResponseDto tournament = adminTournamentService.getTournamentById(id);
        return ResponseEntity.ok(ApiResponse.success(tournament, "Torneo obtenido"));
    }

    /**
     * PUT /api/admin/tournaments/{id}
     * Actualiza un torneo existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TournamentResponseDto>> updateTournament(
            @PathVariable UUID id,
            @RequestBody TournamentRequestDto request) {

        TournamentResponseDto updated = adminTournamentService.updateTournament(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Torneo actualizado exitosamente"));
    }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<ApiResponse<Void>> softDeleteTournament(
    //         @PathVariable UUID id) {

    //     adminTournamentService.softDeleteTournament(id);
    //     return ResponseEntity.ok(ApiResponse.success(null, "Torneo desactivado exitosamente"));
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTournament(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "false") boolean hardDelete) {

        if (hardDelete) {
            adminTournamentService.hardDeleteTournament(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Torneo eliminado permanentemente"));
        } else {
            adminTournamentService.softDeleteTournament(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Torneo desactivado"));
        }
    }


}
