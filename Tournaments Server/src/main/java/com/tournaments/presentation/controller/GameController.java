package com.tournaments.presentation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.service.GameService;
import com.tournaments.domain.model.Game;
import com.tournaments.presentation.response.ApiResponse;

@RestController
@RequestMapping("/games")
@Validated
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // 1️⃣ Para /games (sin parámetros) → todos los juegos
    @GetMapping
    public ResponseEntity<ApiResponse<List<Game>>> getAllGames() {
        List<Game> games = gameService.getAllGames();
        return ResponseEntity.ok(ApiResponse.success(games));
    }

    // 2️⃣ Para /games?ids=1,2,3 → filtro por IDs
    // @GetMapping(params = "ids")
    // public ResponseEntity<ApiResponse<List<Game>>> getGamesByIds(
    //         @RequestParam List<Long> ids) {
    //     List<Game> games = gameService.getGamesByIds(ids);
    //     return ResponseEntity.ok(ApiResponse.success(games));
    // }

    // 3️⃣ Para /games/{id}/exists
    @GetMapping("/{id}/exists")
    public ResponseEntity<ApiResponse<Boolean>> existsById(@PathVariable Long id) {
        boolean exists = gameService.existsById(id);
        return ResponseEntity.ok(ApiResponse.success(exists));
    }
}