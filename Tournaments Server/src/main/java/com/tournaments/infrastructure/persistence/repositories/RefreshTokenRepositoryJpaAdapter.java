package com.tournaments.infrastructure.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.RefreshToken;
import com.tournaments.domain.repository.RefreshTokenRepositoryPort;
import com.tournaments.infrastructure.persistence.entities.RefreshTokenEntity;
import com.tournaments.infrastructure.persistence.mappers.RefreshTokenEntityMapper;

@Repository
public class RefreshTokenRepositoryJpaAdapter implements RefreshTokenRepositoryPort {

    private final JpaRefreshTokenRepository jpaRepository;
    private final RefreshTokenEntityMapper mapper;

    public RefreshTokenRepositoryJpaAdapter(JpaRefreshTokenRepository jpaRepository, RefreshTokenEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return jpaRepository.findByToken(token).map(mapper::toDomain);
    }

    @Override
    public List<RefreshToken> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<RefreshToken> findByUserIdAndRevokedFalse(Long userId) {
        return jpaRepository.findByUserIdAndRevokedFalse(userId).stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        RefreshTokenEntity entity = mapper.toEntity(refreshToken);
        RefreshTokenEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public void deleteByUserId(Long userId) {
        jpaRepository.deleteByUserId(userId);
    }

    @Override
    public void deleteByToken(String token) {
        jpaRepository.deleteByToken(token);
    }
}