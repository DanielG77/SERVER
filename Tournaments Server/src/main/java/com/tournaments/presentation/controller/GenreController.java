package com.tournaments.presentation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tournaments.application.service.GenreService;
import com.tournaments.domain.model.Genre;
import com.tournaments.presentation.response.ApiResponse;

@RestController
@RequestMapping("/genres")
@Validated
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    // 1️⃣ Para /genres (sin parámetros) → todos los géneros
    @GetMapping
    public ResponseEntity<ApiResponse<List<Genre>>> getAllGenres() {
        List<Genre> genres = genreService.getAllGenres();
        return ResponseEntity.ok(ApiResponse.success(genres));
    }

    // 2️⃣ Para /genres?ids=1,2,3 → filtro por IDs
    @GetMapping(params = "ids")
    public ResponseEntity<ApiResponse<List<Genre>>> getGenresByIds(
            @RequestParam List<Long> ids) {
        List<Genre> genres = genreService.getGenresByIds(ids);
        return ResponseEntity.ok(ApiResponse.success(genres));
    }

    // 3️⃣ Para /genres/{id}/exists
    @GetMapping("/{id}/exists")
    public ResponseEntity<ApiResponse<Boolean>> existsById(@PathVariable Long id) {
        boolean exists = genreService.existsById(id);
        return ResponseEntity.ok(ApiResponse.success(exists));
    }
}