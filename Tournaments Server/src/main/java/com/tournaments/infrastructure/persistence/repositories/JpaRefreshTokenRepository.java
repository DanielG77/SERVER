package com.tournaments.infrastructure.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tournaments.infrastructure.persistence.entities.RefreshTokenEntity;

public interface JpaRefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

    Optional<RefreshTokenEntity> findByToken(String token);

    List<RefreshTokenEntity> findByUserId(Long userId);  // ← AÑADIR

    List<RefreshTokenEntity> findByUserIdAndRevokedFalse(Long userId); // ← AÑADIR


    void deleteByUserId(Long userId);

    void deleteByToken(String token);
}