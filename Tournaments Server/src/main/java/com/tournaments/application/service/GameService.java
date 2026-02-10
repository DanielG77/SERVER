package com.tournaments.application.service;

import java.util.List;
import java.util.Optional;

import com.tournaments.domain.model.Game;

public interface GameService {
    List<Game> getAllGames();
    Optional<Game> getGameById(Long id);
    boolean existsById(Long id);
}