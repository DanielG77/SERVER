package com.tournaments.infrastructure.persistence.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Profile;
import com.tournaments.domain.repository.ProfileRepositoryPort;
import com.tournaments.infrastructure.persistence.entities.ProfileEntity;
import com.tournaments.infrastructure.persistence.mappers.ProfileEntityMapper;

@Repository
public class ProfileRepositoryJpaAdapter implements ProfileRepositoryPort {

    private final JpaProfileRepository jpaRepository;
    private final ProfileEntityMapper mapper;

    public ProfileRepositoryJpaAdapter(JpaProfileRepository jpaRepository, ProfileEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Profile> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).map(mapper::toDomain);
    }

    @Override
    public Optional<Profile> findByUsername(String username) {
        return jpaRepository.findByUsername(username).map(mapper::toDomain);
    }

    @Override
    public Profile save(Profile profile) {
        ProfileEntity entity = mapper.toEntity(profile);
        ProfileEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public void deleteByUserId(Long userId) {
        jpaRepository.deleteByUserId(userId);
    }
}