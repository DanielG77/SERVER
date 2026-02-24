package com.tournaments.domain.repository;

import java.util.Optional;

import com.tournaments.domain.model.Role;

public interface RoleRepositoryPort {
    Optional<Role> findByName(String name);
    Role save(Role role);
}
