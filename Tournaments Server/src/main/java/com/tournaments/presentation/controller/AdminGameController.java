package com.tournaments.presentation.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.dto.GameRequestDto;
import com.tournaments.application.dto.GameResponseDto;
import com.tournaments.application.service.AdminGameService;
import com.tournaments.presentation.response.ApiResponse;

/**
 * Controlador REST para operaciones administrativas de juegos.
 * Solo administradores pueden acceder a estos endpoints.
 * Ruta: /api/admin/games
 */
@RestController
@RequestMapping("/api/admin/games")
@PreAuthorize("hasRole('ADMIN')")
public class AdminGameController {

    private final AdminGameService adminGameService;

    public AdminGameController(AdminGameService adminGameService) {
        this.adminGameService = adminGameService;
    }

    /**
     * POST /api/admin/games
     * Crea un nuevo juego.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<GameResponseDto>> createGame(
            @RequestBody GameRequestDto request) {

        GameResponseDto created = adminGameService.createGame(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Juego creado exitosamente"));
    }

    /**
     * GET /api/admin/games
     * Obtiene todos los juegos con paginación.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<GameResponseDto>>> getAllGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<GameResponseDto> games = adminGameService.getAllGames(pageable);
        return ResponseEntity.ok(ApiResponse.success(games, "Juegos obtenidos"));
    }

    /**
     * GET /api/admin/games/{id}
     * Obtiene un juego específico por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GameResponseDto>> getGameById(
            @PathVariable Long id) {

        GameResponseDto game = adminGameService.getGameById(id)
                .orElseThrow(() -> new com.tournaments.domain.exception.ResourceNotFoundException(
                        "Juego no encontrado con ID: " + id));
        return ResponseEntity.ok(ApiResponse.success(game, "Juego obtenido"));
    }

    /**
     * PUT /api/admin/games/{id}
     * Actualiza un juego existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GameResponseDto>> updateGame(
            @PathVariable Long id,
            @RequestBody GameRequestDto request) {

        GameResponseDto updated = adminGameService.updateGame(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Juego actualizado exitosamente"));
    }

    /**
     * DELETE /api/admin/games/{id}
     * Elimina un juego (eliminación física).
     * Nota: Puede causar errores de integridad referencial si el juego
     * está asociado a torneos.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGame(
            @PathVariable Long id) {

        adminGameService.deleteGame(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Juego eliminado exitosamente"));
    }
}
