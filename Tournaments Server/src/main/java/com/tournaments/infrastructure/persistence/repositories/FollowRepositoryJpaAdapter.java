package com.tournaments.infrastructure.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Follow;
import com.tournaments.domain.repository.FollowRepositoryPort;
import com.tournaments.infrastructure.persistence.entities.FollowEntity;
import com.tournaments.infrastructure.persistence.mappers.FollowEntityMapper;

@Repository
public class FollowRepositoryJpaAdapter implements FollowRepositoryPort {

    private final JpaFollowRepository jpaRepository;
    private final FollowEntityMapper mapper;

    public FollowRepositoryJpaAdapter(JpaFollowRepository jpaRepository, FollowEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId) {
        return jpaRepository.findByFollowerIdAndFollowingId(followerId, followingId).map(mapper::toDomain);
    }

    @Override
    public Follow save(Follow follow) {
        FollowEntity entity = mapper.toEntity(follow);
        FollowEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId) {
        jpaRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public List<Follow> findFollowersByUserId(Long userId) {
        return jpaRepository.findFollowersByUserId(userId).stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Follow> findFollowingByUserId(Long userId) {
        return jpaRepository.findFollowingByUserId(userId).stream().map(mapper::toDomain).toList();
    }

    @Override
    public long countFollowersByUserId(Long userId) {
        return jpaRepository.countByFollowingId(userId);
    }

    @Override
    public long countFollowingByUserId(Long userId) {
        return jpaRepository.countByFollowerId(userId);
    }
}