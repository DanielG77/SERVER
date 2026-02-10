package com.tournaments.domain.repository;

import java.util.List;
import java.util.Optional;

import com.tournaments.domain.model.Game;

public interface GameRepository {
    List<Game> findAll();
    Optional<Game> findById(Long id);
    Optional<Game> findByName(String name);
    List<Game> findByIdIn(List<Long> ids);
    boolean existsById(Long id);
}