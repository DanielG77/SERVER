package com.tournaments.domain.repository;

import java.util.Optional;

import com.tournaments.domain.model.RefreshToken;

public interface RefreshTokenRepositoryPort {

    Optional<RefreshToken> findByToken(String token);

    RefreshToken save(RefreshToken refreshToken);

    void deleteByUserId(Long userId);

    void deleteByToken(String token);
}