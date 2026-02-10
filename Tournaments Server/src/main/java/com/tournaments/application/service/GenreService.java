package com.tournaments.application.service;

import java.util.List;

import com.tournaments.domain.model.Genre;

public interface GenreService {
    List<Genre> getAllGenres();
    List<Genre> getGenresByIds(List<Long> ids);
    boolean existsById(Long id);
}