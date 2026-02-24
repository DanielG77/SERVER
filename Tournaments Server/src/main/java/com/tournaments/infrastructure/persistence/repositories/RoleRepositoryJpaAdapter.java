package com.tournaments.infrastructure.persistence.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.tournaments.domain.model.Role;
import com.tournaments.domain.repository.RoleRepositoryPort;
import com.tournaments.infrastructure.persistence.entities.RoleEntity;
import com.tournaments.infrastructure.persistence.mappers.RoleEntityMapper;

@Repository
public class RoleRepositoryJpaAdapter implements RoleRepositoryPort {

    private final JpaRoleRepository jpaRepository;
    private final RoleEntityMapper mapper;

    public RoleRepositoryJpaAdapter(JpaRoleRepository jpaRepository, RoleEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Role> findByName(String name) {
        return jpaRepository.findByName(name).map(mapper::toDomain);
    }

    @Override
    public Role save(Role role) {
        RoleEntity entity = mapper.toEntity(role);
        RoleEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
}