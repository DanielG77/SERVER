package com.tournaments.infrastructure.persistence.repositories.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Game;
import com.tournaments.domain.repository.GameRepository;
import com.tournaments.infrastructure.persistence.mappers.GameMapper;
import com.tournaments.infrastructure.persistence.repositories.jpa.JpaGameRepository;

@Repository
public class GameRepositoryImpl implements GameRepository {

    private final JpaGameRepository jpaGameRepository;

    public GameRepositoryImpl(JpaGameRepository jpaGameRepository) {
        this.jpaGameRepository = jpaGameRepository;
    }

    @Override
    public List<Game> findAll() {
        return jpaGameRepository.findAll().stream()
                .map(GameMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Game> findById(Long id) {
        return jpaGameRepository.findById(id)
                .map(GameMapper::toDomain);
    }

    @Override
    public Optional<Game> findByName(String name) {
        return jpaGameRepository.findByName(name)
                .map(GameMapper::toDomain);
    }

    @Override
    public List<Game> findByIdIn(List<Long> ids) {
        return jpaGameRepository.findByIdIn(ids).stream()
                .map(GameMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Game> findByNameIgnoreCase(String name) {
        return jpaGameRepository.findByNameIgnoreCase(name)
                .map(GameMapper::toDomain);
    }

    @Override
    public List<Game> findByNameIgnoreCaseContaining(String name) {
        return jpaGameRepository.findByNameIgnoreCaseContaining(name).stream()
                .map(GameMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(Long id) {
        return jpaGameRepository.existsById(id);
    }
}