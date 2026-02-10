package com.tournaments.domain.repository;

import java.util.List;

import com.tournaments.domain.model.Genre;

public interface GenreRepository {
    List<Genre> findAll();
    List<Genre> findByIdIn(List<Long> ids);
    boolean existsById(Long id);
}