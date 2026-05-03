package com.tournaments.infrastructure.persistence.repositories.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tournaments.infrastructure.persistence.entities.GameEntity;

public interface JpaGameRepository extends JpaRepository<GameEntity, Long> {
    Optional<GameEntity> findByName(String name);
    Optional<GameEntity> findByNameIgnoreCase(String name);
    List<GameEntity> findByNameIgnoreCaseContaining(String name);
    List<GameEntity> findByIdIn(List<Long> ids);
    List<GameEntity> findByOrderByNameAsc();
}